const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const ProductVariationRepository = require('../../../infrastructure/repositories/product_variation');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const { throwError } = require('../helpers');

const productRepository = new ProductRepository(database);
const productVariationRepository = new ProductVariationRepository(database);
const productPhotoRepository = new ProductPhotoRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  logicalDelete: async ({ body }) => {
    const f = async (transaction) => {
      const { products_ids_list: productIdList } = body;
      const deleteAt = moment().tz('America/Sao_Paulo').toISOString();

      await productPhotoRepository.logicalDelete(productIdList, deleteAt, transaction);
      await productVariationRepository.logicalDelete(productIdList, deleteAt, transaction);
      await productRepository.logicalDelete(productIdList, deleteAt, transaction);
      return httpResponse(204);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'products/logicalDelete');
    }
  },
};
