const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const S3Implementation = require('../../../infrastructure/implementations/s3');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const s3 = new S3Implementation(s3Client);
const companyRepository = new CompanyRepository(database);

module.exports = {
  deleteBanner: async ({ params, companyId }) => {
    try {
      const id = (!params.ID) ? companyId : params.ID;
      const { banner } = await companyRepository.findOne(['banner'], id);
      if (banner) {
        await s3.deleteFile(banner);
        await companyRepository.updateBannerOrLogo(id, true);
      }
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/deleteBanner');
      return httpResponse(500);
    }
  },
};
