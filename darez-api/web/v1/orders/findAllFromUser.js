const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const OrderRepository = require('../../../infrastructure/repositories/order');
const { toSlack } = require('../slack');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const orderRepository = new OrderRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

const allFromDateRange = async ({ initial, end }, userId) => {
  const orders = await orderRepository.findAllDateRange({ initial, end }, userId);
  return httpResponse(200, { orders });
};

module.exports = {
  findAllFromUser: async ({ query, params, userId }) => {
    try {
      const { page, pageSize } = (query.page && query.pageSize)
        ? query : { page: 0, pageSize: 2000 };
      const id = (!params.ID) ? userId : params.ID;
      if (query.initialDate && query.endDate) {
        return allFromDateRange({
          initial: query.initialDate, end: query.endDate,
        }, id);
      }
      const orders = await orderRepository.findAllFromUser({ page, pageSize }, id);
      return httpResponse(200, { orders, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'orders/findAllFromUser');
      return httpResponse(500);
    }
  },
};
