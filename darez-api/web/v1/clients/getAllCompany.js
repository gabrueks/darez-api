const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyClientRepository = require('../../../infrastructure/repositories/company_clients');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyClientRepository = new CompanyClientRepository(database);

module.exports = {
  getAllCompany: async ({ companyId }) => {
    try {
      const attributes = ['id', 'company_id', 'name', 'phone_country_code', 'phone_area_code', 'phone_number', 'email'];
      const clients = await companyClientRepository.getAllCompany(companyId, attributes);
      return httpResponse(200, clients);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'clients/getAllCompany');
      return httpResponse(500);
    }
  },
};
