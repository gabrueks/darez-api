const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const SubcategoryRepository = require('../../../infrastructure/repositories/subcategory');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const subcategoryRepository = new SubcategoryRepository(database);

module.exports = {
  findSubcategoriesCategory: async ({ params }) => {
    const { category } = params;
    try {
      const result = await subcategoryRepository.findAllSubcategoryCategory(category);
      return httpResponse(200, result);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'categories/findSubcategoriesCategory');
      return httpResponse(500);
    }
  },
};
