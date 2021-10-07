const { createPayment } = require('../../../infrastructure/implementations/asaas_api');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const OrderRepository = require('../../../infrastructure/repositories/order');
const UserRepository = require('../../../infrastructure/repositories/user');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const {
  checkAsaasExistence, emailGenerator, dateFormater, throwError,
  paymentMethods: { CREDIT_CARD },
} = require('../helpers');

const companyRepository = new CompanyRepository(database);
const orderRepository = new OrderRepository(database);
const userRepository = new UserRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  createPayment: async ({ userId, body }) => {
    const f = async (transaction) => {
      const {
        order_id: orderId, credit_card: creditCard, card_holder: cardHolder,
      } = body;
      const order = await orderRepository.findOne(orderId, ['company_id', 'payment_method', 'price',
        'cep', 'street_number', 'address_2'], transaction);
      const { asaas_account_key: asaasAccountKey } = await companyRepository.findOne(['asaas_account_key'], order.company_id, transaction);
      const {
        asaas_id: asaasId,
      } = await checkAsaasExistence(userId, order.company_id, asaasAccountKey, transaction);
      const user = await userRepository.findOne(userId, ['phone_area_code', 'phone_number'], transaction);
      const ownerEmail = emailGenerator();
      const paymentMethod = (order.payment_method === CREDIT_CARD) ? 'CREDIT_CARD' : 'BOLETO';
      const data = await createPayment(
        asaasAccountKey, asaasId, paymentMethod, order.price,
        dateFormater('aaaa-mm-dd'), orderId,
        {
          holderName: creditCard.holder_name,
          number: creditCard.number,
          expiryMonth: creditCard.expiry_month,
          expiryYear: creditCard.expiry_year,
          ccv: creditCard.ccv,
        },
        {
          name: creditCard.holder_name,
          email: ownerEmail,
          cpfCnpj: cardHolder.document,
          phone: `${user.phone_area_code} ${user.phone_number}`,
          postalCode: order.cep,
          addressNumber: order.street_number,
          addressComplement: order.address_2,
        },
      );
      await orderRepository.update(orderId, {
        asaas_object: data.object,
        asaas_id: data.id,
        asaas_status: data.status,
        asaas_invoice_url: data.invoiceUrl,
        asaas_bank_slip_url: data.bankSlipUrl,
        asaas_net_value: data.netValue,
        asaas_owner_email: ownerEmail,
        asaas_invoice_number: data.invoiceNumber,
      }, transaction);
      return httpResponse(201);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      console.error(err);
      return throwError(err, 'payments/createPayment');
    }
  },
};
