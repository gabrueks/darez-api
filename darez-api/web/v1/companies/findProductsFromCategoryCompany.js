const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { getIdFromQuery } = require('../helpers');
const { toSlack } = require('../slack');

const { invalidRequest, slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productRepository = new ProductRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findProductsFromCategoryCompany: async ({ params, query }) => {
    try {
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      const id = getIdFromQuery(query);
      const { category } = params;
      const attributes = ['id', 'company_id', 'name', 'description', 'price', 'category', 'subcategory', 'promotion', 'sort_id'];
      const result = await productRepository
        .findAllProductsFromCategoryCompany(id, category, attributes, timeString);
      return httpResponse(200, { products: result, bucket_url: bucketUrl });
    } catch (err) {
      if (err.message === invalidRequest) return httpResponse(400, { message: invalidRequest });
      // eslint-disable-next-line no-console
      console.log('FIND ALL PRODUCTS FROM CATEGORY COMPANY => ', err);
      toSlack(SLACK_ERR, err, 'companies/findProductsFromCategoryCompany');
      return httpResponse(500);
    }
  },
};
