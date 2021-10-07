const Boom = require('@hapi/boom');
// const asaasApi = require('./index');
const axios = require('axios');

module.exports = async (assasApiKey, name, mobilePhone, cpfCnpj, externalReference) => {
  try {
    // const { data } = await asaasApi.post('/api/v3/customers',
    const { data } = await axios.post(`${process.env.ASAAS_URL}/api/v3/customers`,
      {
        name, cpfCnpj, mobilePhone, externalReference,
      },
      {
        headers: {
          access_token: assasApiKey,
        },
      });
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('CREATE ASAAS CLIENT => ', err);
    throw Boom.internal(err);
  }
};
