/* eslint-disable no-console */
const { Op } = require('sequelize');
const asyncPool = require('tiny-async-pool');
const database = require('../darez-api/infrastructure/database/models');
const { createAccount } = require('../darez-api/web/v1/payments/createAccount');

(async () => {
  await database.sequelize.authenticate();
  const companies = await database.Company.findAll({
    attributes: ['id'],
    raw: true,
    where: {
      [Op.and]: {
        asaas_account_key: null,
        active: 1,
      },
    },
  });

  const timeout = new Promise((resolve) => setTimeout(() => resolve(), 1200));

  return asyncPool(1,
    companies.map(async ({ id: companyId }) => {
      try {
        const response = await createAccount({ companyId });
        if (response.statusCode !== 201) {
          throw Error('Falha ao criar Asaas Account');
        }
        return console.log(`DONE ${companyId}`);
      } catch (error) {
        return console.log(error);
      }
    }), timeout);
})();
