const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const { throwError } = require('../helpers');

const productRepository = new ProductRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  sorting: async ({ body, companyId }) => {
    const f = async (transaction) => {
      const { id, old_sort_id: oldSortId, new_sort_id: newSortId } = body;
      const sumSub = oldSortId < newSortId ? 1 : 2;
      const products = await productRepository
        .findProductToSort(companyId, oldSortId, newSortId, sumSub, transaction);
      const list = products.map((value) => value.id);
      await productRepository.update(id, { sort_id: newSortId }, transaction);
      await productRepository.updateSumSubSort(list, sumSub, transaction);
      return httpResponse(204);
    };
    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'products/sorting');
    }
  },
};
