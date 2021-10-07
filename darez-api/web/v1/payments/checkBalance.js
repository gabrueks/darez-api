const { checkBalance: checkAsaasBalance } = require('../../../infrastructure/implementations/asaas_api');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { forbidden, slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const { toSlack } = require('../slack');

const companyRepository = new CompanyRepository(database);

module.exports = {
  checkBalance: async ({ companyId }) => {
    try {
      const company = await companyRepository.findOne(['asaas_account_key'], companyId);
      if (!company.asaas_account_key) throw new Error(forbidden);
      const { totalBalance } = await checkAsaasBalance(company.asaas_account_key);
      return httpResponse(200, { balance: totalBalance });
    } catch (err) {
      if (err.message === forbidden) return httpResponse(403, { message: forbidden });
      // eslint-disable-next-line no-console
      console.log(err);
      toSlack(SLACK_ERR, err, 'payments/checkBalance');
      return httpResponse(500);
    }
  },
};
