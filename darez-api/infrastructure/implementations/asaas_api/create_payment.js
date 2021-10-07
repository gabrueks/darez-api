const Boom = require('@hapi/boom');
// const asaasApi = require('.');
const axios = require('axios');

module.exports = async (
  assasApiKey, customer, billingType, value, dueDate, externalReference, creditCard,
  creditCardHolderInfo,
) => {
  try {
    // const { data } = await asaasApi.post('/api/v3/customers',
    const { data } = await axios.post(`${process.env.ASAAS_URL}/api/v3/payments`,
      {
        customer,
        billingType,
        value,
        dueDate,
        externalReference,
        creditCard,
        creditCardHolderInfo,
      },
      {
        headers: {
          access_token: assasApiKey,
        },
      });
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('CREATE ASAAS PAYMENT => ', err);
    throw Boom.internal(err);
  }
};
