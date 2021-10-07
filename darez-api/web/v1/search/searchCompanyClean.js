const { httpResponse } = require('../../../infrastructure/adapters/http');
const { client } = require('../../../infrastructure/adapters/algolia');
const { toSlack } = require('../slack');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const indexCompany = client.initIndex(process.env.ALGOLIA_INDEX_COMPANIES);

/**
 * Clean up Algolia's cache
 */
module.exports = {
  clearCompanies: async () => {
    try {
      await indexCompany.clearObjects();
      return httpResponse(204);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      toSlack(SLACK_ERR, error, 'search/searchCompanyClean');
      return httpResponse(500);
    }
  },
};
