const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const PromotionRepository = require('../../../infrastructure/repositories/promotion');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productRepository = new ProductRepository(database);
const promotionRepository = new PromotionRepository(database);

module.exports = {
  scheduleDelete: async () => {
    const deleteAt = moment().tz('America/Sao_Paulo').toISOString();
    try {
      const promotionsIds = await promotionRepository.scheduleDelete(deleteAt);
      await Promise.all(promotionsIds.map(async (promotion) => {
        await productRepository.deletePromotion(promotion.id);
      }));
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'promotions/scheduleDelete');
      return httpResponse(500);
    }
  },
};
