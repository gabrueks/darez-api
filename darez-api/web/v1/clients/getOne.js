const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyClientRepository = require('../../../infrastructure/repositories/company_clients');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyClientRepository = new CompanyClientRepository(database);

module.exports = {
  getOne: async ({ params, companyId }) => {
    try {
      const attributes = ['id', 'company_id', 'name', 'phone_country_code', 'phone_area_code', 'phone_number', 'email'];
      const client = await companyClientRepository.getOne(params.ID, companyId, attributes);
      return httpResponse(200, client);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'clients/getOne');
      return httpResponse(500);
    }
  },
};
