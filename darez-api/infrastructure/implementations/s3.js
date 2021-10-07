const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

const { AWS_BUCKET_NAME } = process.env;

module.exports = class S3Implementation {
  constructor(s3Client) {
    this.s3Client = s3Client;
  }

  async uploadBase64(image, fileName, type, local) {
    // eslint-disable-next-line new-cap
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `${local}/${Date.now()}_${fileName}`,
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };
    try {
      return this.s3Client.upload(params).promise();
    } catch (err) {
      throw Boom.internal(err);
    }
  }

  async uploadFile(image, local) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        ACL: 'public-read',
        Body: fs.createReadStream(image),
        Key: `${local}/${Date.now()}_${path.basename(image)}`,
      };
      try {
        const response = this.s3Client.upload(params).promise();
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteFile(imageKey) {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: imageKey,
    };
    try {
      this.s3Client.deleteObject(params).promise();
    } catch (err) {
      throw Boom.internal(err);
    }
  }
};
