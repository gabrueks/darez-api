const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const { getIdFromQuery } = require('../helpers');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const { invalidRequest } = require('../helpers');

const productRepository = new ProductRepository(database);
const productPhotoRepository = new ProductPhotoRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findAllProducts: async ({ query }) => {
    try {
      const id = getIdFromQuery(query);
      const currentDateTime = moment().tz('America/Sao_Paulo');
      const timeString = currentDateTime.toISOString();
      const attributes = ['id', 'company_id', 'name', 'description', 'price', 'category', 'subcategory', 'promotion', 'sort_id'];
      const result = await productRepository.findAllFromCompany(
        id, timeString, attributes, timeString,
      );
      const mainImages = await productPhotoRepository.findAllMainFromCompany(id);
      if (mainImages) {
        result.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          if (item.id in mainImages) item.photo_key = mainImages[item.id];
        });
      }
      return httpResponse(200, { products: result, bucket_url: bucketUrl });
    } catch (err) {
      if (err.message === invalidRequest) return httpResponse(400, { message: invalidRequest });
      // eslint-disable-next-line no-console
      console.log('FIND ALL PRODUCTS => ', err);
      toSlack(SLACK_ERR, err, 'companies/findAllProducts');
      return httpResponse(500);
    }
  },
};
