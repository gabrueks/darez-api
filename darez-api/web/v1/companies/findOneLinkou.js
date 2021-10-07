const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');
const { invalidRequest, slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findOneLinkou: async ({ params }) => {
    try {
      const { endpoint } = params;
      if (!endpoint) { throw new Error(invalidRequest); }
      const companyAttributes = ['id', 'phone_country_code', 'phone_area_code', 'phone_number',
        'endpoint', 'instagram_url', 'facebook_url', 'fantasy_name', 'logo', 'banner'];
      const result = await companyRepository.findOneEndpoint(companyAttributes, endpoint);
      if (!(result)) throw new Error(invalidRequest);
      return httpResponse(200, { ...result, bucket_url: bucketUrl });
    } catch (error) {
      if (error.message === invalidRequest) return httpResponse(400, { message: invalidRequest });
      toSlack(SLACK_ERR, error, 'companies/findOneLinkou');
      return httpResponse(500);
    }
  },
};
