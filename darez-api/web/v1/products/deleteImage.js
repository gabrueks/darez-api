const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const S3Implementation = require('../../../infrastructure/implementations/s3');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productPhotoRepository = new ProductPhotoRepository(database);
const s3 = new S3Implementation(s3Client);

module.exports = {
  deleteImage: async ({ params, body }) => {
    try {
      const { image_id: imageId } = body;
      const photoKeys = await productPhotoRepository.findAllById(['photo_key'], imageId, params.ID);
      const success = photoKeys.map(async ({ photo_key: key }) => {
        await s3.deleteFile(key);
      });
      await Promise.all(success);
      await productPhotoRepository.deleteMany(imageId, params.ID);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'products/deleteImage');
      return httpResponse(500);
    }
  },
};
