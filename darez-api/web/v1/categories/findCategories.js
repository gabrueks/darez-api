const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CategoryRepository = require('../../../infrastructure/repositories/category');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const categoryRepository = new CategoryRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findCategories: async ({ query }) => {
    const { lat, lng } = query;
    try {
      const attributes = ['name', 'icon', 'banner'];
      const result = (lat && lng)
        ? await categoryRepository.findAllRegion(attributes, query)
        : await categoryRepository.findAll(attributes);
      const data = result.map((item) => item.dataValues);
      return httpResponse(200, { categories: data, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'categories/findCategories');
      return httpResponse(500);
    }
  },
};
