const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

  return JSON.stringify(event, null, 2);
};
