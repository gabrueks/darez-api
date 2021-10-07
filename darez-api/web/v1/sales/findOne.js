const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);

module.exports = {
  findOne: async ({ params, companyId }) => {
    try {
      const response = await companySaleRepository.findOne(params.ID, companyId);
      return httpResponse(200, response);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'sales/findOne');
      return httpResponse(500);
    }
  },
};
