const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const PromotionRepository = require('../../../infrastructure/repositories/promotion');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const { findCreator, throwError } = require('../helpers');

const productRepository = new ProductRepository(database);
const promotionRepository = new PromotionRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  update: async ({ params, body, companyId }) => {
    const f = async (transaction) => {
      const { ID: promotionId } = params;

      const { products } = body;
      const promotion = body;
      delete promotion.products;
      const creator = await findCreator(companyId, false, transaction);
      await promotionRepository.update(
        promotionId, { ...promotion, updated_by: creator }, transaction,
      );
      await Promise.all(products.add.map(async (product) => {
        await productRepository.update(product.id,
          { promotion: promotionId, promotion_price: product.promotion_price },
          transaction);
      }));
      await Promise.all(products.delete.map(async (product) => {
        await productRepository.update(product,
          { promotion: null, promotion_price: null },
          transaction);
        const productIds = await productRepository.findAllProductsFromPromotion(promotionId, ['id'], transaction);
        if (productIds.length === 0) {
          await promotionRepository.update(
            promotionId, { active: false, updated_by: creator, deleted_by: creator }, transaction,
          );
        }
      }));
      return httpResponse(204);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'promotions/update');
    }
  },
};
