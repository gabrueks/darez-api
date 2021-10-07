const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const CategoryRepository = require('../../../infrastructure/repositories/category');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyRepository = new CompanyRepository(database);
const categoryRepository = new CategoryRepository(database);
const productRepository = new ProductRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  findOneNoLogin: async ({ params }) => {
    try {
      const { ID: id } = (params);
      if (id === 'endpoint') {
        return httpResponse(400);
      }
      const attributes = ['fantasy_name', 'cep', 'street', 'street_number', 'address_2', 'neighborhood', 'city', 'state',
        'phone_country_code', 'phone_area_code', 'phone_number', 'banner', 'logo', 'delivery_range',
        'latitude', 'longitude', 'endpoint'];
      const result = await companyRepository.findOne(attributes, id);
      if (result === null) {
        return httpResponse(400);
      }
      const wantedCategory = !(result.category)
        ? await productRepository.topCategory(id)
        : result.category;
      const { banner } = (wantedCategory) ? await categoryRepository.findOne(wantedCategory, ['banner'])
        : { banner: null };
      result.banner = !(result.banner) ? banner : result.banner;
      return httpResponse(200, { ...result, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'companies/findOneNoLogin');
      return httpResponse(500);
    }
  },
};
