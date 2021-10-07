const { httpResponse } = require('../../../infrastructure/adapters/http');
const { client } = require('../../../infrastructure/adapters/algolia');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { settings } = require('./searchCompaniesSettings');
const { toSlack } = require('../slack');
const { algoliaMessages, slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const indexCompany = client.initIndex(process.env.ALGOLIA_INDEX_COMPANIES);

const companyRepository = new CompanyRepository(database);

/**
 * It will perform index to Algolia's cache, when the search feature
 * will be used to locate informed data.
 */
module.exports = {
  indexCompanies: async () => {
    if (!indexCompany) {
      httpResponse(500, {
        message: algoliaMessages.ALGOLIA_ENVIRONMENT_MESSSAGE_COMPANIES,
      });
    }
    try {
      const results = await companyRepository.findAllToSearch();
      await indexCompany.setSettings(settings);
      await indexCompany.saveObjects(results);
      return httpResponse(200, results);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'search/searchCompanyIndex');
      return httpResponse(500);
    }
  },
};
