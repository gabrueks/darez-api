const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { client } = require('../../../infrastructure/adapters/algolia');
const { settings } = require('./searchproductsSettings');
const { toSlack } = require('../slack');
const { algoliaMessages, slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const indexProduct = client.initIndex(process.env.ALGOLIA_INDEX_PRODUCTS);

const productRepository = new ProductRepository(database);

/**
 * It will perform index to Algolia's cache, when the search feature
 * will be used to locate informed data.
*/
module.exports = {
  indexProducts: async () => {
    if (!indexProduct) {
      httpResponse(500, {
        message: algoliaMessages.ALGOLIA_ENVIRONMENT_MESSSAGE_PRODUCTS,
      });
    }
    try {
      const results = await productRepository.findAllToSearch();
      await indexProduct.setSettings(settings);
      await indexProduct.saveObjects(results);
      return httpResponse(200, results);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'search/searchProductIndex');
      return httpResponse(500);
    }
  },
};
