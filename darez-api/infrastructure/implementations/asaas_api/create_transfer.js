const Boom = require('@hapi/boom');
// const asaasApi = require('./index');
const axios = require('axios');
const { unavailableAmount } = require('../../../web/v1/helpers/strings');

module.exports = async (
  assasApiKey, value, code, ownerName, cpfCnpj, agency, account, accountDigit, bankAccountType) => {
  try {
    // const { data } = await asaasApi.post('/api/v3/customers',
    const { data } = await axios.post(`${process.env.ASAAS_URL}/api/v3/transfers`,
      {
        value,
        bankAccount: {
          bank: { code },
          ownerName,
          cpfCnpj,
          agency,
          account,
          accountDigit,
          bankAccountType,
        },
      },
      {
        headers: {
          access_token: assasApiKey,
        },
      });
    return data;
  } catch (err) {
    if (
      err.response
      && err.response.status === 400
      && err.response.data.errors[0].code === 'invalid_action') throw new Error(unavailableAmount);
    // eslint-disable-next-line no-console
    console.log('CREATE ASAAS CLIENT => ', err);
    throw Boom.internal(err);
  }
};
