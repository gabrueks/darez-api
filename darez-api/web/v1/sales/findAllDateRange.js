const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);

module.exports = {
  findAllDateRange: async ({ companyId, query }) => {
    try {
      const { start, end } = query;
      const startRaw = start.split('/');
      const startDate = startRaw[2].concat('-', startRaw[1], '-', startRaw[0], ' 00:00:00');
      const endRaw = end.split('/');
      const endDate = endRaw[2].concat('-', endRaw[1], '-', endRaw[0], ' 23:59:59');
      const response = await companySaleRepository.findAllDateRange(companyId, startDate, endDate);
      return httpResponse(200, response);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'sales/findAllDateRange');
      return httpResponse(500);
    }
  },
};
