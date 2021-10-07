const { S3 } = require('aws-sdk');

module.exports = {
  s3Client: new S3(),
};
