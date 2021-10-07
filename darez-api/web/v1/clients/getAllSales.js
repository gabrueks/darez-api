const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);

module.exports = {
  getAllSales: async ({ params, companyId }) => {
    try {
      const attributes = ['id', 'company_id', 'client_id', 'price', 'description', 'sale_time', 'sale_method'];
      const sales = await companySaleRepository.getAllClient(companyId, params.ID, attributes);
      return httpResponse(200, { sales });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'clients/getAllSales');
      return httpResponse(500);
    }
  },
};
