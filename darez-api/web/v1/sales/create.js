const moment = require('moment-timezone');

const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { slackChannel: { SLACK_ERR, SLACK_SALES } } = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);
const companyRepository = new CompanyRepository(database);

module.exports = {
  create: async ({ body, companyId }) => {
    try {
      const {
        description, price, client_id: clientId, split_times: splitTimes,
        date, time, sale_method: saleMethod,
      } = body;

      const sales = [];
      const splits = (!splitTimes) ? 1 : splitTimes;
      const splitPrice = price / splits;
      for (let i = 0; i < splits; i += 1) {
        sales.push({
          company_id: companyId,
          description,
          price: splitPrice,
          client_id: clientId,
          sale_method: saleMethod,
          sale_time: moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm').tz('America/Sao_Paulo').add(30 * i, 'days'),
          split_times: splits,
          split_number: i + 1,
        });
      }

      await companySaleRepository.create(sales);
      const company = await companyRepository.findOne(
        ['fantasy_name', 'phone_area_code', 'phone_number', 'neighborhood', 'city', 'state'],
        companyId,
      );
      toSlack(SLACK_SALES, `Nova venda cadastrada!
Empresa: ${company.fantasy_name}
Telefone: +55 ${company.phone_area_code} ${company.phone_number}
Bairro: ${company.neighborhood}
Cidade: ${company.city}
Estado: ${company.state}
Valor: ${body.price},
Tipo: ${body.sale_method},
Descrição: ${body.description}
`);
      return httpResponse(201);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('sales/create => ', error);
      toSlack(SLACK_ERR, error, 'sales/create');
      return httpResponse(500);
    }
  },
};
