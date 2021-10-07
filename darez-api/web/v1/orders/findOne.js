/* eslint-disable */

const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const OrderRepository = require('../../../infrastructure/repositories/order');
const OrderProductsRepository = require('../../../infrastructure/repositories/order_product');
const { toSlack } = require('../slack');

const { invalidRequest, slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const UserRepository = require('../../../infrastructure/repositories/user');

const orderRepository = new OrderRepository(database);
const companyRepository = new CompanyRepository(database);
const userRepository = new UserRepository(database);
const orderProductsRepository = new OrderProductsRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  /**
   * Get Order by {ID}
   */
  findOne: async ({ params }) => {
    try {
      const { ID: id } = params;
      const result = await orderRepository.findOne(id, ['company_id','buyer', 'cep', 'street',
        'street_number', 'address_2', 'neighborhood', 'city', 'state', 'price', 'payment_method',
        'status', 'created_at']);
      if (!result) {
        return httpResponse(400, { message: invalidRequest });
      }
      result.order_products = await orderProductsRepository.findAllFromOrder(id);
      result.count_products = await orderProductsRepository.countProducts(id);
      const buyerInfo = await userRepository.findOne(result.buyer, [
        'phone_country_code', 'phone_area_code', 'phone_number', 'full_name',
      ]);
      const companyInfo = await companyRepository.findOne([
        'phone_country_code', 'phone_area_code', 'phone_number', 'fantasy_name',
      ], result.company_id);
      result.buyer_info = buyerInfo;
      result.company_info = companyInfo;
      result.bucket_url = bucketUrl;
      return httpResponse(200, result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('FIND ONE ORDER => ', error);
      toSlack(SLACK_ERR, error, 'orders/findOne');
      return httpResponse(500);
    }
  },
};
