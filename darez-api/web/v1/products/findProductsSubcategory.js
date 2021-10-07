const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productRepository = new ProductRepository(database);

module.exports = {
  findProductsSubcategory: async ({ params }) => {
    try {
      const { ID: companyId } = params;
      const result = await productRepository.findProductsSubcategory(companyId);
      const finalData = {};
      result.forEach(({ subcategory, category, countProducts }) => {
        if (finalData[category] === undefined) {
          finalData[category] = {};
        }
        finalData[category][subcategory] = countProducts;
      });
      return httpResponse(200, finalData);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'products/findProductsSubcategory');
      return httpResponse(500, {});
    }
  },
};
