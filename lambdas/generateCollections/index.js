const moment = require('moment');
const Handlebars = require('handlebars');
const cumulusMessageAdapter = require('@cumulus/cumulus-message-adapter-js');
const { scheduler } = require('@cumulus-ce/api');
const Rule = require('@cumulus-ce/api/models/rules');

/**
 * Generates collection-like objects and schedules the 'DiscoverAndDownloadGranules' workflow.
 *
 * @param  {Object} event Lambda event, with config and collection types
 * @return {Object}       Message
 */
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
