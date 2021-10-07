const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductVariationRepository = require('../../../infrastructure/repositories/product_variation');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productVariationRepository = new ProductVariationRepository(database);

module.exports = {
  deleteProdVariation: async ({ params, body }) => {
    try {
      const { product_variation: productVariation } = body;
      const deleteAt = moment().tz('America/Sao_Paulo').toISOString();
      await productVariationRepository.deleteMany(productVariation, params.ID, deleteAt);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'products/deleteProdVariation');
      return httpResponse(500);
    }
  },
};
