const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { fieldVerification } = require('../helpers');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findCompanies: async ({ query }) => {
    const { page, pageSize } = !(query.page && query.pageSize)
      ? { page: 0, pageSize: 2000 } : query;
    const attributes = (query.field) ? fieldVerification(query.field) : null;
    try {
      const result = await companyRepository.findAll(page, pageSize, attributes);
      return httpResponse(200, { companies: result, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'companies/findCompanies');
      return httpResponse(500);
    }
  },
};
