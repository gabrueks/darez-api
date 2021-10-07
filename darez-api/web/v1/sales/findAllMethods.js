const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { database } = require('../../../infrastructure/adapters/database');
const SaleMethodRepository = require('../../../infrastructure/repositories/sale_method');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const saleMethodRepository = new SaleMethodRepository(database);

module.exports = {
  findAllMethods: async () => {
    try {
      const response = await saleMethodRepository.findAll();
      return httpResponse(200, response);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'sales/findAllSaleMethods');
      return httpResponse(500);
    }
  },
};
