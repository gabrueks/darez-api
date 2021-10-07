const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findAllCategory: async ({ params, query }) => {
    try {
      const { category } = params;
      const { lat, lng } = query;
      const result = (lat && lng) ? await companyRepository.findAllCategoryRegion(
        category, query,
      ) : await companyRepository.findAllCategory(category);
      return httpResponse(200, { companies: result, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'companies/findAllCategory');
      return httpResponse(500);
    }
  },
};
