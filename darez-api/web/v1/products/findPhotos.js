const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productPhotoRepository = new ProductPhotoRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findPhotos: async ({ params }) => {
    try {
      const images = await productPhotoRepository.findPhotos(params.ID, ['id', 'photo_key']);
      return httpResponse(200, { images, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'products/findPhotos');
      return httpResponse(500);
    }
  },
};
