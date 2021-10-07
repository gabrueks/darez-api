const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findOneCompany: async ({ params, companyId }) => {
    try {
      const id = (!params.ID) ? companyId : params.ID;
      const result = await companyRepository.findOne(null, id);
      return httpResponse(200, { ...result, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'companies/findOneCompany');
      return httpResponse(500);
    }
  },
};
