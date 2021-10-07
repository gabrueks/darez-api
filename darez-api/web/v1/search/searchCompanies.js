const { httpResponse } = require('../../../infrastructure/adapters/http');
const { filterCoords } = require('../helpers');
const { client } = require('../../../infrastructure/adapters/algolia');
const { settings } = require('./searchCompaniesSettings');
const { toSlack } = require('../slack');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const indexCompany = client.initIndex(process.env.ALGOLIA_INDEX_COMPANIES);

const { AWS_BUCK_URL: bucketUrl } = process.env;

/**
 * Create a query using Algolia's cache as resource
 */
module.exports = {
  searchCompanies: async ({ body, params }) => {
    const { latitude, longitude } = body;
    const { search } = params;
    try {
      await indexCompany.setSettings(settings);
      const { hits } = await indexCompany.search(search);
      const companies = latitude && longitude
        ? filterCoords(hits || [], latitude, longitude)
        : hits;
      const data = {
        bucket_url: bucketUrl,
        companies,
      };
      return httpResponse(200, data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('ERRO NO SEARCH => ', error);
      toSlack(SLACK_ERR, error, 'search/searchCompanies');
      return httpResponse(500);
    }
  },
};
