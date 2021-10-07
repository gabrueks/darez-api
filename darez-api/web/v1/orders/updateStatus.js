const { httpResponse } = require('../../../infrastructure/adapters/http');
const { refundPayment } = require('../../../infrastructure/implementations/asaas_api');
const { database } = require('../../../infrastructure/adapters/database');
const OrderRepository = require('../../../infrastructure/repositories/order');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const {
  orderStatusString: { CANCELLED }, slackChannel: { SLACK_ERR },
} = require('../helpers/strings');
const { toSlack } = require('../slack');

const orderRepository = new OrderRepository(database);
const companyRepository = new CompanyRepository(database);

module.exports = {
  updateStatus: async ({
    body, params,
  }) => {
    try {
      const { status } = body;
      const fields = { ...body };
      if (status === CANCELLED) {
        const order = await orderRepository.findOne(params.ID, ['company_id', 'asaas_id']);
        if (order.asaas_id) {
          const company = await companyRepository.findOne(['asaas_account_key'], order.company_id);
          const data = await refundPayment(company.asaas_account_key, order.asaas_id);
          fields.asaas_status = data.status;
        }
      }
      await orderRepository.update(params.ID, fields);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'orders/updateStatus');
      return httpResponse(500);
    }
  },
};
