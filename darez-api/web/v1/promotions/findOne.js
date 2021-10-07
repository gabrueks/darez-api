const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { toSlack } = require('../slack');
const PromotionRepository = require('../../../infrastructure/repositories/promotion');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const { AWS_BUCK_URL: bucketUrl } = process.env;

const promotionRepository = new PromotionRepository(database);

module.exports = {
  findOne: async ({ params }) => {
    const { ID: promotionId } = params;
    try {
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      const promotion = await promotionRepository.findOne(promotionId, timeString);
      return httpResponse(200, { promotion, bucket_url: bucketUrl });
    } catch (err) {
      toSlack(SLACK_ERR, err, 'promotions/findOne');
      return httpResponse(500);
    }
  },
};
