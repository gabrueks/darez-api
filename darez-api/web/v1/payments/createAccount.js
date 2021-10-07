const { createAccount: createAsaasAccount } = require('../../../infrastructure/implementations/asaas_api');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const CompanyPaymentRepository = require('../../../infrastructure/repositories/company_payment');
const {
  forbidden, emailGenerator, slackChannel: { SLACK_ERR }, paymentMethods: { CREDIT_CARD },
} = require('../helpers');
const { toSlack } = require('../slack');

const companyRepository = new CompanyRepository(database);
const companyPaymentRepository = new CompanyPaymentRepository(database);

const { ASAAS_API_KEY } = process.env;

module.exports = {
  createAccount: async ({ companyId }) => {
    try {
      const company = await companyRepository.findOne(
        ['fantasy_name', 'document', 'phone_area_code', 'phone_number', 'street', 'street_number',
          'address_2', 'neighborhood', 'cep', 'asaas_account_key'],
        companyId,
      );
      if (company.asaas_account_key) throw new Error(forbidden);
      const email = emailGenerator();
      const { apiKey, walletId, object } = await createAsaasAccount(
        ASAAS_API_KEY,
        company.fantasy_name,
        email,
        company.document,
        `${company.phone_area_code} ${company.phone_number}`,
        company.street,
        company.street_number,
        company.address_2,
        company.neighborhood,
        company.cep,
        'MEI',
      );
      await companyRepository.update(companyId, {
        asaas_account_key: apiKey,
        asaas_login_email: email,
        asaas_wallet_id: walletId,
        asaas_object: object,
      });
      await companyPaymentRepository.create(companyId, CREDIT_CARD);
      return httpResponse(201);
    } catch (err) {
      if (err.message === forbidden) return httpResponse(403, { message: forbidden });
      // eslint-disable-next-line no-console
      console.log(err);
      toSlack(SLACK_ERR, err, 'payments/createAccount');
      return httpResponse(500);
    }
  },
};
