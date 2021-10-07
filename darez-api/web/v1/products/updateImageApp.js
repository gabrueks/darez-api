const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const S3Implementation = require('../../../infrastructure/implementations/s3');
const { toSlack } = require('../slack');

const {
  buildImgName, slackChannel: { SLACK_ERR },
} = require('../helpers');

const productPhotoRepository = new ProductPhotoRepository(database);
const s3 = new S3Implementation(s3Client);

module.exports = {
  updateImageApp: async ({ params, body }) => {
    try {
      const { files } = body;
      await Promise.all(files.map(async (item) => {
        const { key } = await s3.uploadBase64(item.file, buildImgName(item.type), item.type, 'products');
        await productPhotoRepository.create({
          product_id: params.ID,
          photo_key: key,
        });
      }));
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'products/updateImageApp');
      return httpResponse(500);
    }
  },
};
