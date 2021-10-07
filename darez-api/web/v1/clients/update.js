const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyClientRepository = require('../../../infrastructure/repositories/company_clients');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyClientRepository = new CompanyClientRepository(database);

module.exports = {
  update: async ({ body, params, companyId }) => {
    try {
      await companyClientRepository.update(body, params.ID, companyId);
      return httpResponse(204);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'clients/update');
      return httpResponse(500);
    }
  },
};
