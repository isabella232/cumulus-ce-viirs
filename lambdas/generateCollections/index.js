const moment = require('moment');
const Handlebars = require('handlebars');
const cumulusMessageAdapter = require('@cumulus/cumulus-message-adapter-js');
const { scheduler } = require('@cumulus-ce/api');
const Rule = require('@cumulus-ce/api/models/rules');

const collection = {
  "name": "viirs_template",
  "templated_name": "viirs_{{pointInTime}}",
  "version": "001",
  "files": [
    {
      "regex": "(.*)\\.tgz",
      "bucket": "internal",
      "sampleFileName": "SVDNB_npp_20180301-20180331_00N060E_vcmcfg_v10_c201804022005.tgz"
    }
  ],
  "provider_path": "/instruments/remote-sensing/passive/spectrometers-radiometers/imaging/viirs/dnb_composites/v10/{{pointInTime}}/vcmcfg/",
  "granuleIdExtraction": "(.*)\\.tgz",
  "granuleId": "SVDNB_npp_20180301-20180331_00N060E_vcmcfg_v10_c201804022005",
  "sampleFileName": "SVDNB_npp_20180301-20180331_00N060E_vcmcfg_v10_c201804022005.tgz",
  "dataType": "viirs-collection",
  "options": {
    "spanUnit": "month",
    "spanStart": "201204",
    "spanEnd": "201206"
  }
};

const event = {
  config: {
    provider: 'viirs_provider',
    collection: collection
  }
}

const generateCollections = async function(event) {
  const options = event.config.collection.options;
  const dateFormat = 'YYYYMM';
  const spanEnd = options.spanEnd ? moment(options.spanEnd, dateFormat) : moment();
  const spanUnit = options.spanUnit || 'day';
  const spanStart = moment(options.spanStart, dateFormat);

  let currentPointInTime = spanStart;
  let pointsInTime = [];
  while (currentPointInTime <= spanEnd) {
    pointsInTime.push(currentPointInTime);
    currentPointInTime = currentPointInTime.clone().add(1, spanUnit);
  }
  const template = Handlebars.compile(JSON.stringify(event.config.collection));
  const newCollections = pointsInTime.map((pot) => {
    const config = {pointInTime: pot.format(dateFormat)};
    let newCollection = JSON.parse(template(config));
    newCollection.name = newCollection.templated_name;
    delete newCollection.templated_name;
    return newCollection;
  });

  const payloads = newCollections.map(async (c) => {
    const item = {
      workflow: 'DiscoverAndDownloadGranules',
      provider: event.config.provider || {},
      collection: c,
      payload: event.input || {}
    };
    const payload = await Rule.buildPayload(item);
    return new Promise((resolve, reject) => scheduler(payload, {}, (err, result) => {
      if (err) reject(err);
      resolve(result);
    }));
  });

  return {
    message: `Scheduled ${payloads.length} workflows`
  };
}

function handler(event, context, callback) {
  cumulusMessageAdapter.runCumulusTask(generateCollections, event, context, callback);
}
exports.handler = handler;

process.env.bucket = 'cumulus-devseed-internal';
process.env.stackName = 'cce';
process.env.ProvidersTable = 'cce-ProvidersTable';
process.env.CollectionsTable = 'cce-CollectionsTable';
generateCollections(event)
  .then(console.log)
  .catch(console.log);
