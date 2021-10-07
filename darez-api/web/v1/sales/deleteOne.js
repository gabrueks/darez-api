const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);

module.exports = {
  deleteOne: async ({ params, companyId }) => {
    try {
      await companySaleRepository.deleteOne(params.ID, companyId);
      return httpResponse(204);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'sales/findOne');
      return httpResponse(500);
    }
  },
};
