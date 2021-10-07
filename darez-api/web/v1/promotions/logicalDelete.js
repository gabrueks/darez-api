const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const PromotionRepository = require('../../../infrastructure/repositories/promotion');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const { throwError } = require('../helpers');

const productRepository = new ProductRepository(database);
const promotionRepository = new PromotionRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  logicalDelete: async ({ params }) => {
    const f = async (transaction) => {
      const { ID: promotionId } = params;
      const deleteAt = moment().tz('America/Sao_Paulo').toISOString();
      const productIds = await productRepository.findAllProductsFromPromotion(promotionId, ['id'], transaction);
      if (productIds !== []) {
        const successRemove = productIds.map(async (product) => {
          await productRepository.update(product.id,
            { promotion: null, promotion_price: null }, transaction);
        });
        await Promise.all(successRemove);
      }
      await promotionRepository.logicalDelete(promotionId, deleteAt, transaction);
      return httpResponse(204);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'promotions/logicalDelete');
    }
  },
};
