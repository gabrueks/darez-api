const { createClient } = require('../../../../infrastructure/implementations/asaas_api');
const { database } = require('../../../../infrastructure/adapters/database');
const UserAsaasRepository = require('../../../../infrastructure/repositories/user_asaas');
const UserRepository = require('../../../../infrastructure/repositories/user');
const TransactionRepository = require('../../../../infrastructure/repositories/transaction');
const throwError = require('../throwError');

const userAsaasRepository = new UserAsaasRepository(database);
const userRepository = new UserRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = async (userId, companyId, asaasKey) => {
  const f = async (transaction) => {
    const user = await userRepository.findOne(userId, [
      'full_name', 'phone_area_code', 'phone_number', 'document', 'id',
    ], transaction);
    const data = await createClient(
      asaasKey,
      user.full_name,
      `${user.phone_area_code} ${user.phone_number}`,
      user.document,
      user.id,
    );
    const result = await userAsaasRepository.create({
      user_id: userId,
      company_id: companyId,
      asaas_id: data.id,
      asaas_created_at: data.dateCreated,
      asaas_object: data.object,
      asaas_account_key: asaasKey,
    }, transaction);
    return result;
  };

  try {
    const result = await transactionRepository.transaction(f);
    if (result.error) return throwError(result.error, 'users/create');
    return result;
  } catch (err) {
    return throwError(err, 'helpers/payments/createAsaasClient');
  }
};
