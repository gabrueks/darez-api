const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

module.exports = {
  findNeighborhood: async () => {
    try {
      const result = await companyRepository.findAllNeighborhoods();
      const finalData = {};
      result.forEach((item) => {
        if (!(item.city in finalData)) {
          finalData[item.city] = [item.neighborhood];
        } else {
          finalData[item.city].push(item.neighborhood);
        }
      });
      return httpResponse(200, finalData);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'companies/findNeighborhood');
      return httpResponse(500);
    }
  },
};
