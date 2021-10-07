const Boom = require('@hapi/boom');
const axios = require('axios');
// const asaasApi = require('.');

module.exports = async (
  assasApiKey, name, email, cpfCnpj, phone, address, addressNumber, complement, province,
  postalCode, companyType,
) => {
  try {
    // const { data } = await asaasApi.post('/api/v3/accounts',
    const { data } = await axios.post(`${process.env.ASAAS_URL}/api/v3/accounts`,
      {
        name,
        email,
        cpfCnpj,
        phone,
        address,
        addressNumber,
        complement,
        province,
        postalCode,
        companyType,
      },
      {
        headers: {
          access_token: assasApiKey,
        },
      });
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('CREATE ASAAS ACCOUNT => ', err);
    throw Boom.internal(err.message);
  }
};
