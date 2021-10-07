const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');

const productRepository = new ProductRepository(database);

module.exports = {
  findNewSort: async (companyId, transaction) => {
    const value = await productRepository.findLastSort(companyId, transaction);
    return (value + 1);
  },
};
