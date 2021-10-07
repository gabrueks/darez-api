const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { invalidRequest, getIdFromQuery } = require('../helpers');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  getLogo: async ({ query }) => {
    try {
      const id = getIdFromQuery(query);
      const logo = await companyRepository.findOne(['logo'], id);
      return httpResponse(200, { ...logo, bucket_url: bucketUrl });
    } catch (err) {
      if (err.message === invalidRequest) return httpResponse(400, { message: invalidRequest });
      toSlack(SLACK_ERR, err, 'companies/getLogo');
      return httpResponse(500);
    }
  },
};
