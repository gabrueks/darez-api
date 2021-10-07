const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const CategoryRepository = require('../../../infrastructure/repositories/category');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { toSlack } = require('../slack');
const { invalidRequest, slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);
const categoryRepository = new CategoryRepository(database);
const productRepository = new ProductRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findOneEndpoint: async ({ params }) => {
    try {
      const { endpoint } = params;
      if (!endpoint) { throw new Error(invalidRequest); }
      const result = await companyRepository.findOneEndpoint(null, endpoint);
      if (!result) { throw new Error(invalidRequest); }
      const wantedCategory = !(result.category)
        ? await productRepository.topCategory(result.id)
        : result.category;
      const { banner } = (wantedCategory) ? await categoryRepository.findOne(wantedCategory, ['banner'])
        : { banner: null };
      result.banner = !(result.banner) ? banner : result.banner;
      result.bucket_url = bucketUrl;
      return httpResponse(200, result);
    } catch (error) {
      if (error.message === invalidRequest) return httpResponse(400, { message: invalidRequest });
      toSlack(SLACK_ERR, error, 'companies/findOneEndpoint');
      return httpResponse(500);
    }
  },
};
