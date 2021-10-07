const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);

module.exports = {
  update: async ({ body, companyId, params }) => {
    try {
      const { ID: id } = params;
      const { date, time, ...sale } = body;
      if (date) {
        const dateTemp = date.split('/');
        sale.sale_time = dateTemp[2].concat('-', dateTemp[1], '-', dateTemp[0], ' ', time, ':00');
      }
      await companySaleRepository.update(sale, id, companyId);
      return httpResponse(204);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'sales/update');
      return httpResponse(500);
    }
  },
};
