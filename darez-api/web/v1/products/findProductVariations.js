const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductVariationRepository = require('../../../infrastructure/repositories/product_variation');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productVariationRepository = new ProductVariationRepository(database);

module.exports = {
  findProductVariations: async ({ params }) => {
    try {
      const attributes = ['id', 'color', 'size'];
      const { ID: productId } = params;
      const result = await productVariationRepository.findProductVariations(attributes, productId);
      return httpResponse(200, result);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'products/findProductVariations');
      return httpResponse(500, {});
    }
  },
};
