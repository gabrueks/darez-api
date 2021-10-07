const Boom = require('@hapi/boom');
// const asaasApi = require('.');
const axios = require('axios');

module.exports = async (assasApiKey, paymentId) => {
  try {
    // const { data } = await asaasApi.post('/api/v3/payments/${paymentId}/refund',
    const { data } = await axios.post(`${process.env.ASAAS_URL}/api/v3/payments/${paymentId}/refund`, {},
      {
        headers: {
          access_token: assasApiKey,
        },
      });
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('REFUND ASAAS PAYMENT => ', err);
    throw Boom.internal(err);
  }
};
