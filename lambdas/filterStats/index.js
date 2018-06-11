// WIP
const { S3 } = require('aws-sdk');
const Papa = require('papaparse');
const s3 = new S3();

const bucket = 'cumulus-devseed-protected';
const params = {
  Bucket: bucket,
  Prefix: 'sezu-stats/Ahti_River_EPZ_'
};

const tile = '00N060W';
let means = {};

s3.listObjects(params, (err, data) => {
  data.Contents.forEach((obj) => {
    if (obj.Key.includes(tile)) {
      const yearMonth = obj.Key.match(/_(\d{6})_/)[1];
      s3.getObject({Bucket: bucket, Key: obj.Key}, (err, objData) => {
        const contents = objData.Body.toString();
        const stats = Papa.parse(contents, {header: true, dynamicTyping: true}).data;
        means[yearMonth] = stats[0].mean;
      });
    };    
  });
});
