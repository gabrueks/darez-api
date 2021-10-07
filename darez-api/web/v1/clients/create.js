const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyClientRepository = require('../../../infrastructure/repositories/company_clients');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyClientRepository = new CompanyClientRepository(database);

module.exports = {
  create: async ({ body, companyId }) => {
    try {
      const { dataValues: { id } } = await companyClientRepository.create(body, companyId);
      return httpResponse(201, { id, company_id: companyId });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'clients/create');
      return httpResponse(500);
    }
  },
};
