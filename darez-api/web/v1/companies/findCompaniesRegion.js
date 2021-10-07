const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');

const { invalidRequest, slackChannel: { SLACK_ERR } } = require('../helpers');

const companyRepository = new CompanyRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findCompaniesRegion: async ({ query }) => {
    try {
      const { page, pageSize } = !(query.page && query.pageSize)
        ? { page: 0, pageSize: 2000 } : query;
      const { lat, lng } = query;
      const { range } = query;
      if (range) {
        if (!(lat && lng)) throw new Error(invalidRequest);
        const result = await companyRepository.findAllRegionMap(
          page, pageSize, { ...query }, range,
        );
        return httpResponse(200, { companies: result, bucket_url: bucketUrl });
      }
      // eslint-disable-next-line
      const result = (lat && lng) ? await companyRepository.findAllRegion(page, pageSize, { ...query })
        : await companyRepository.findAllRegionNoLoc(page, pageSize);
      return httpResponse(200, { companies: result, bucket_url: bucketUrl });
    } catch (error) {
      if (error.message === invalidRequest) return httpResponse(400, { message: invalidRequest });
      toSlack(SLACK_ERR, error, 'companies/findCompaniesRegion');
      return httpResponse(500);
    }
  },
};
