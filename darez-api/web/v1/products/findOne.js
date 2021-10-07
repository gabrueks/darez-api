const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productRepository = new ProductRepository(database);

module.exports = {
  findOne: async ({ params }) => {
    try {
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      const result = await productRepository.findOne(null, params.ID, timeString);
      return httpResponse(200, result);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'products/findOne');
      return httpResponse(500);
    }
  },
};
