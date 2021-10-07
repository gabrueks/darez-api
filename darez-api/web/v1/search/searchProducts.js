const { httpResponse } = require('../../../infrastructure/adapters/http');
const { filterCoords } = require('../helpers');
const { client } = require('../../../infrastructure/adapters/algolia');
const { settings } = require('./searchproductsSettings');
const { toSlack } = require('../slack');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const indexProduct = client.initIndex(process.env.ALGOLIA_INDEX_PRODUCTS);

const { AWS_BUCK_URL: bucketUrl } = process.env;

/**
 * Create a query using Algolia's cache as resource
 */
module.exports = {
  searchProducts: async ({ body, params }) => {
    const { latitude, longitude, company_id: companyId } = body;
    const { search } = params;
    try {
      await indexProduct.setSettings(settings);
      const { hits } = await indexProduct.search(search, companyId ? {
        filters: `company_id:'${companyId}'`,
      } : {});
      const products = latitude && longitude ? filterCoords(hits || [], latitude, longitude) : hits;
      const data = {
        bucket_url: bucketUrl,
        products,
      };
      return httpResponse(200, data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toSlack(SLACK_ERR, error, 'search/searchProducts');
      return httpResponse(500);
    }
  },
};
