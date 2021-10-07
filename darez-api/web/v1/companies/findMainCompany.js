const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');
const { setupMainCompany } = require('../helpers/strings');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

const genericBanners = [
  {
    banner_url_high_res: setupMainCompany.HOME_DEFAULT_BANNER_COMPANY_HIGH_DEF,
    banner_url_low_res: setupMainCompany.HOME_DEFAULT_BANNER_COMPANY_LOW_DEF,
  },
];

module.exports = {
  findMainCompany: async ({ query }) => {
    try {
      const { lat, lng, range } = query;
      if (lat && lng) {
        const company = await companyRepository.findMainCompany({ lat, lng, range });
        if (company) {
          // eslint-disable-next-line camelcase
          const { company_main_banners } = company;
          // eslint-disable-next-line camelcase
          if (company_main_banners) {
            return httpResponse(200, { ...company, bucket_url: bucketUrl });
          }
          return httpResponse(200,
            { ...company, company_main_banners: genericBanners, bucket_url: bucketUrl });
        }
      }
      return httpResponse(200, { company_main_banners: genericBanners, bucket_url: bucketUrl });
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/findMainCompany');
      // eslint-disable-next-line no-console
      console.log(err);
      return httpResponse(500);
    }
  },
};
