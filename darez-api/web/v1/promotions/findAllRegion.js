const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { toSlack } = require('../slack');
const PromotionRepository = require('../../../infrastructure/repositories/promotion');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const { AWS_BUCK_URL: bucketUrl } = process.env;

const promotionRepository = new PromotionRepository(database);

module.exports = {
  findAllRegion: async ({ query }) => {
    try {
      const { page, pageSize } = !(query.page && query.pageSize)
        ? { page: 0, pageSize: 2000 } : query;
      const { lat, lng } = query;
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      const promotion = (lat && lng) ? await promotionRepository.findAllRegion(
        page, pageSize, timeString, { ...query },
      ) : await promotionRepository.findAll(page, pageSize, timeString);
      return httpResponse(200, { promotion, bucket_url: bucketUrl });
    } catch (err) {
      toSlack(SLACK_ERR, err, 'promotions/findAllRegion');
      return httpResponse(500);
    }
  },
};
