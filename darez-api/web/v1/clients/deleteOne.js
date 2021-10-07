const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyClientRepository = require('../../../infrastructure/repositories/company_clients');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyClientRepository = new CompanyClientRepository(database);

module.exports = {
  deleteOne: async ({ params, companyId }) => {
    try {
      await companyClientRepository.deleteOne(params.ID, companyId);
      return httpResponse(200);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'clients/deleteOne');
      return httpResponse(500);
    }
  },
};
