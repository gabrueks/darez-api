const fs = require('fs');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const { toSlack } = require('../slack');
const CategoryRepository = require('../../../infrastructure/repositories/category');
const BuildRepository = require('../../../infrastructure/repositories/build');
const S3Implementation = require('../../../infrastructure/implementations/s3');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const { AWS_BUCK_URL: bucketUrl } = process.env;

const categoryRepository = new CategoryRepository(database);
const buildRepository = new BuildRepository(database);
const s3 = new S3Implementation(s3Client);

const { writeFile } = require('../helpers/files');

module.exports = {
  buildRoute: async () => {
    try {
      const companiesAttributes = ['id', 'endpoint', 'fantasy_name', 'banner', 'phone_number',
        'logo', 'phone_country_code', 'phone_area_code', 'cep', 'street', 'street_number',
        'address_2', 'neighborhood', 'city', 'state', 'delivery_range', 'latitude', 'longitude',
        'category'];

      const productAttributes = ['id', 'name', 'description', 'category', 'subcategory', 'sort_id',
        'promotion', 'promotion_price', 'price'];

      const productVariationAttributes = ['id', 'color', 'size'];

      const productPhotosAttributes = ['id', 'photo_key', 'is_main', 'thumbnail'];

      const companies = await buildRepository.getCompanies(
        companiesAttributes, productAttributes, productVariationAttributes, productPhotosAttributes,
      );
      const categories = await categoryRepository.findAll(['name', 'icon', 'banner']);
      const filename = `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}${Date.now()}.json`;
      const { path } = await writeFile(JSON.stringify({ companies, categories, bucket_url: bucketUrl }), filename, 'utf-8');
      const { Key } = await s3.uploadFile(path, 'build');
      fs.unlinkSync(path);
      return httpResponse(201, { bucket_url: bucketUrl, file_key: Key });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'build/builRoute');
      return httpResponse(500);
    }
  },
};
