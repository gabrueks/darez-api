const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const S3Implementation = require('../../../infrastructure/implementations/s3');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);
const s3 = new S3Implementation(s3Client);

module.exports = {
  deleteLogo: async ({ params, companyId }) => {
    try {
      const id = (!params.ID) ? companyId : params.ID;
      const { logo } = await companyRepository.findOne(['logo'], id);
      if (logo) {
        await s3.deleteFile(logo);
        await companyRepository.updateBannerOrLogo(id, false);
      }
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/deleteLogo');
      return httpResponse(500);
    }
  },
};
