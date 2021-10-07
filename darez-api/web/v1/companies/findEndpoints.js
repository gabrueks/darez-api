const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

module.exports = {
  findEndpoints: async () => {
    try {
      const result = await companyRepository.findEndpoints();
      return httpResponse(200, result);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'companies/findEndpoints');
      return httpResponse(500);
    }
  },
};
