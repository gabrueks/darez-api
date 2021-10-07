/* eslint-disable no-unused-expressions */
const moment = require('moment-timezone');
const fs = require('fs');

const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const { pdfGenerator, mergePages } = require('../../../infrastructure/implementations/pdfManager');
const CompanySaleRepository = require('../../../infrastructure/repositories/company_sales');
const CompanyRepository = require('../../../infrastructure/repositories/company');

const { buildUserAddress } = require('../helpers');

const {
  slackChannel: { SLACK_ERR }, moneyFormater,
  dateSpliter, saleMethods: {
    CASH, DEBIT, CREDIT, EXPENSE,
  }, invalidRequest,
} = require('../helpers/strings');

const companySaleRepository = new CompanySaleRepository(database);
const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

const processTotals = (methods) => {
  const result = {
    totalValue: 0,
    totalExpense: 0,
    totalDebit: 0,
    totalCredit: 0,
    totalCash: 0,
  };

  methods.forEach((item) => {
    result.totalValue += (item.total * item.operator);
    if (item.saleMethod === CASH) result.totalCash = moneyFormater(item.total);
    else if (item.saleMethod === DEBIT) result.totalDebit = moneyFormater(item.total);
    else if (item.saleMethod === CREDIT) result.totalCredit = moneyFormater(item.total);
    else if (item.saleMethod === EXPENSE) result.totalExpense = moneyFormater(item.total);
  });
  result.totalValue = moneyFormater(result.totalValue);

  return result;
};

const color = {
  RED: '#CD2424',
  BLUE: '#3F7CE7',
  LIGHT_BLUE: '#00B9E6',
  DARK_BLUE: '#214C99',
  GREEN_BLUE: '#336480',
};

module.exports = {
  kadernet: async ({ query, companyId }) => {
    try {
      if (!(query.start && query.end)) throw new Error(invalidRequest);
      const generatedDatetime = moment().tz('America/Sao_Paulo');
      const generateDate = generatedDatetime.format('DD/MM/YYYY');
      const generateTime = generatedDatetime.format('HH:mm');

      const startDate = moment(dateSpliter(query.start)).tz('America/Sao_Paulo');
      const endDate = moment(dateSpliter(query.end, true)).tz('America/Sao_Paulo');

      const appliedFilter = `${query.start} à ${query.end}`;

      const company = await companyRepository.findOne(
        ['logo', 'fantasy_name', 'phone_area_code', 'phone_number', 'street', 'street_number', 'address_2', 'neighborhood', 'city', 'state'],
        companyId,
      );
      const sales = await companySaleRepository
        .findAllDateRangeClient(companyId, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss'));
      const methods = await companySaleRepository
        .findTotalFromRange(companyId, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss'));
      if (!sales || sales.length === 0) return httpResponse(204);

      // Gráfico de Despesas e Receitas
      // [ 'Despesas', 'Receita' ]
      // [ '106.67', 102606.19 ]
      const expenseTotals = methods
        .find((method) => method.operator === -1).total;
      const totalSalesValues = methods
        .reduce((method1, method2) => (method1
          + (method2.operator === 1 ? Number(method2.total) : 0)), 0);
      const spendsReceipt = {
        data: [(expenseTotals) || 0, totalSalesValues],
        labels: ['Despesas', 'Receita'],
        colors: [color.RED, color.BLUE],
      };

      // Gráfico de tipo de recebimento
      // [ 'Dinheiro', 'Débito', 'Crédito' ]
      // [ '25.00', '19.44', '19.44', '36.11' ]
      const filteredMethods = methods.filter((method) => method.saleMethod !== EXPENSE);
      const totalSales = filteredMethods.reduce((m1, m2) => m1 + m2.countSaleMethod, 0);
      const receiveGraph = {
        data: filteredMethods.map((method) => Number(
          ((method.countSaleMethod * 100) / totalSales).toFixed(2),
        )),
        labels: filteredMethods.map((method) => method.saleMethod),
        colors: [color.BLUE, color.LIGHT_BLUE, color.DARK_BLUE],
        totalValue: `${totalSalesValues.toFixed(2)}`,
      };

      // Gráfico Por dia da semana
      // [
      //   'segunda-feira',
      //   'terça-feira',
      //   'quarta-feira',
      //   'quinta-feira',
      //   'sexta-feira',
      //   'sábado',
      //   'domingo'
      // ]
      // [ 75.28, 326.76, 101955.26, 35.55, 0, 0, 0 ]
      const weekValues = {
        'segunda-feira': 0,
        'terça-feira': 0,
        'quarta-feira': 0,
        'quinta-feira': 0,
        'sexta-feira': 0,
        sábado: 0,
        domingo: 0,
      };
      const daysObjects = {};
      const perDayLabel = [...new Set(sales.map((sale) => sale.date))];
      perDayLabel.forEach((day) => {
        daysObjects[day] = 0;
      });
      sales.forEach((sale) => {
        /* eslint-disable no-unused-expressions */
        sale.type === EXPENSE
          ? 0
          : weekValues[moment(sale.date, 'DD/MM/YYYY').locale('pt-br').format('dddd')] += Number(sale.price);
        sale.type === EXPENSE
          ? 0
          : daysObjects[sale.date] += Number(sale.price);
        /* eslint-enable no-unused-expressions */
      });
      const perDayValues = Object.keys(daysObjects)
        .map(((value) => Number(daysObjects[value].toFixed(2))));
      const perDay = {
        data: perDayValues,
        labels: perDayLabel,
        colors: perDayValues.map(() => color.BLUE),
      };

      const perWeekData = Object.keys(weekValues).map(
        (value) => Number(weekValues[value].toFixed(2)),
      );
      const perWeek = {
        data: perWeekData,
        labels: Object.keys(weekValues),
        colors: perWeekData.map((item) => ((item > 0) ? color.BLUE : color.RED)),
      };

      const hours = sales.map((sale) => moment(sale.saleTime).format('HH:mm').split(':')[0]).sort();
      const filteredHours = [...new Set(hours), 1, 2, 3, 4];
      const hoursAndRanges = filteredHours.map((hour, i) => {
        const firstHour = Number(filteredHours[0]) + (2 * i);
        const secondHour = Number(filteredHours[0]) + (2 * i + 2);
        return secondHour > 24 ? null : ({
          label: `${firstHour > 24 ? firstHour - 24 : firstHour}h - ${secondHour}h`,
          range: [firstHour, firstHour + 1, firstHour + 2],
          sum: 0,
          index: i,
        });
      }).filter((hoursFilter) => hoursFilter !== null);
      sales.forEach((sale) => {
        const i = hoursAndRanges.find((value) => value.range.includes(Number(moment(sale.saleTime).format('HH:mm').split(':')[0]))).index;
        // eslint-disable-next-line no-unused-expressions
        sale.type === EXPENSE ? 0 : hoursAndRanges[i].sum += Number(sale.price);
      });
      const hoursLabel = hoursAndRanges.map((hourAndRange) => hourAndRange.label);
      const hoursValues = hoursAndRanges.map((hourAndRange) => hourAndRange.sum);
      const perHour = {
        data: hoursValues,
        labels: hoursLabel,
        colors: hoursValues.map((item) => ((item > 0) ? color.BLUE : color.RED)),
      };

      const pdfPage1 = await pdfGenerator('kadernetPage1', {
        appliedFilter,
        logo: `${bucketUrl}${company.logo}`,
        fantasy_name: company.fantasy_name,
        address: buildUserAddress(company),
        phone_area_code: company.phone_area_code,
        phone_number: company.phone_number,
        generateDate,
        generateTime,
        spendsReceipt,
        receiveGraph,
        perDay,
        perWeek,
        perHour,
      }, companyId);

      const pdfPage2 = await pdfGenerator('kadernetPage2', {
        appliedFilter,
        logo: `${bucketUrl}${company.logo}`,
        fantasy_name: company.fantasy_name,
        address: buildUserAddress(company),
        phone_area_code: company.phone_area_code,
        phone_number: company.phone_number,
        generateDate,
        generateTime,
        ...processTotals(methods),
        sales,
        totalLines: sales.length,
      }, companyId);

      const pdfFinal = await mergePages(pdfPage2, pdfPage1, companyId);
      const pdfData = await fs.readFileSync(pdfFinal);
      const report = await pdfData.toString('base64');
      fs.unlinkSync(pdfFinal);

      return httpResponse(200, { report });
    } catch (error) {
      if (error.message === invalidRequest) return httpResponse(400, { message: invalidRequest });

      toSlack(SLACK_ERR, error, 'reports/kadernet');
      return httpResponse(500);
    }
  },
};
