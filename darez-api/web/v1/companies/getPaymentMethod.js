const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyPaymentRepository = require('../../../infrastructure/repositories/company_payment');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const { toSlack } = require('../slack');

const companyPaymentRepository = new CompanyPaymentRepository(database);

module.exports = {
  getPaymentMethods: async ({ params }) => {
    try {
      const methods = await companyPaymentRepository.findAllFromCompany(params.ID);
      return httpResponse(200, { methods });
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/getPaymentMethod');
      return httpResponse(500);
    }
  },
};
