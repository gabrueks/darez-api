const Boom = require('@hapi/boom');
const createAsaasClient = require('./createAsaasClient');
const { database } = require('../../../../infrastructure/adapters/database');
const UserAsaasRepository = require('../../../../infrastructure/repositories/user_asaas');

const userAsaasRepository = new UserAsaasRepository(database);

module.exports = async (userId, companyId, asaasKey, transaction) => {
  try {
    const userAsaas = await userAsaasRepository.findOne(
      userId, companyId,
      ['asaas_id', 'asaas_account_key'], transaction,
    );
    return (!userAsaas)
      ? await createAsaasClient(userId, companyId, asaasKey)
      : userAsaas;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Boom.internal();
  }
};
