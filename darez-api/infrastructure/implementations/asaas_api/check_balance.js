const Boom = require('@hapi/boom');
// const asaasApi = require('./index');
const axios = require('axios');

module.exports = async (assasApiKey) => {
  try {
    // const { data } = await asaasApi.post('/api/api/v3/finance/getCurrentBalance',
    const { data } = await axios.get(`${process.env.ASAAS_URL}/api/v3/finance/getCurrentBalance`,
      {
        headers: {
          access_token: assasApiKey,
        },
      });
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('CHECK ASAAS BALANCE => ', err);
    throw Boom.internal(err);
  }
};
