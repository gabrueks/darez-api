const moment = require('moment-timezone');
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
  create: async ({ body, companyId }) => {
    const f = async (transaction) => {
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      const creator = await findCreator(companyId, false, transaction);
      const { products } = body;
      const promotion = body;
      delete promotion.products;
      if (!promotion.has_limit_date) {
        promotion.date_start = timeString;
        promotion.date_end = '3000'.concat(timeString.substring(4, timeString.length));
      } else {
        const dateEnd = promotion.date_end.split('/');
        const dateStart = promotion.date_start.split('/');
        promotion.date_start = dateStart[2].concat('-', dateStart[1], '-', dateStart[0]);
        promotion.date_end = dateEnd[2].concat('-', dateEnd[1], '-', dateEnd[0]);
      }
      const { id: promotionId } = await promotionRepository.create(
        {
          ...promotion,
          company_id: companyId,
          created_by: creator,
        },
        transaction,
      );
      await Promise.all(products.map(async (product) => {
        await productRepository.update(product.id,
          { promotion: promotionId, promotion_price: product.promotion_price },
          transaction);
      }));
      return httpResponse(201, { promotion_id: promotionId });
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'promotions/create');
    }
  },
};
