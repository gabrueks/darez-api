const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const S3Implementation = require('../../../infrastructure/implementations/s3');
const { toSlack } = require('../slack');

const {
  buildImgName, slackChannel: { SLACK_ERR },
} = require('../helpers');

const companyRepository = new CompanyRepository(database);
const s3 = new S3Implementation(s3Client);

module.exports = {
  updateBannerApp: async ({ params, companyId, body }) => {
    try {
      const { file, type } = body;
      const id = !params.ID ? companyId : params.ID;
      const { banner } = await companyRepository.findOne(['banner'], id);
      if (banner) await s3.deleteFile(banner);
      const { key } = await s3.uploadBase64(file, buildImgName(type), type, 'banners');
      await companyRepository.updateBannerOrLogo(id, true, key);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/updateBannerApp');
      return httpResponse(500);
    }
  },
};
