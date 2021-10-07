const { httpResponse } = require('../../../infrastructure/adapters/http');
const { client } = require('../../../infrastructure/adapters/algolia');
const { toSlack } = require('../slack');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const indexProduct = client.initIndex(process.env.ALGOLIA_INDEX_PRODUCTS);

/**
 * Clean up Algolia's cache
 */
module.exports = {
  clearProducts: async () => {
    try {
      await indexProduct.clearObjects();
      return httpResponse(204);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      toSlack(SLACK_ERR, error, 'search/searchProductsClean');
      return httpResponse(500);
    }
  },
};
