const fs = require('fs');
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
  updateBanner: async ({ params, file, companyId }) => {
    try {
      const id = (!params.ID) ? companyId : params.ID;
      const { banner } = await companyRepository.findOne(['banner'], id);
      if (banner) await s3.deleteFile(banner);
      const { destination, filename, path } = file;
      const { key } = await s3.uploadFile(destination + filename, 'banners');
      fs.unlinkSync(path);
      await companyRepository.updateBannerOrLogo(id, true, key);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'companies/updateBanner');
      return httpResponse(500);
    }
  },
};
