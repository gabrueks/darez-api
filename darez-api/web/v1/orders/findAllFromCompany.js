const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const OrderRepository = require('../../../infrastructure/repositories/order');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const orderRepository = new OrderRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

const allFromDateRange = async ({ initial, end }, companyId) => {
  const orders = await orderRepository.findAllDateRange({ initial, end }, companyId, true);
  return httpResponse(200, { orders });
};

module.exports = {
  findAllFromCompany: async ({ query, params, companyId }) => {
    try {
      const { page, pageSize } = (query.page && query.pageSize)
        ? query : { page: 0, pageSize: 2000 };
      const id = (!params.ID) ? companyId : params.ID;
      if (query.initialDate && query.endDate) {
        return allFromDateRange({
          initial: query.initialDate, end: query.endDate,
        }, id);
      }
      const orders = await orderRepository.findAllFromCompany(id, { page, pageSize });
      const { total_orders: totalOrders } = await orderRepository.countTotal(id);
      const pages = (totalOrders % pageSize > 0)
        ? Math.floor(totalOrders / pageSize) + 1
        : Math.floor(totalOrders / pageSize);
      return httpResponse(200, { orders, pages, bucket_url: bucketUrl });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'orders/findAllFromCompany');
      return httpResponse(500);
    }
  },
};
