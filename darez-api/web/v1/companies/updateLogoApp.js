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
  updateLogoApp: async ({ params, companyId, body }) => {
    try {
      const { file, type } = body;
      const id = !params.ID ? companyId : params.ID;
      const { logo } = await companyRepository.findOne(['logo'], id);
      if (logo) await s3.deleteFile(logo);
      const { key } = await s3.uploadBase64(file, buildImgName(type), type, 'logos');
      await companyRepository.updateBannerOrLogo(id, false, null, key);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/updateLogoApp');
      return httpResponse(500);
    }
  },
};
