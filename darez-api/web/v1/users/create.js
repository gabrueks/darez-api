const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const UserGroupRepository = require('../../../infrastructure/repositories/user_group');
const {
  confirmationCodeExpired, sendConfirmationCode, invalidPhoneNumber,
  reuseLastCode, throwError,
} = require('../helpers');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');

const userRepository = new UserRepository(database);
const userGroupRepository = new UserGroupRepository(database);
const transactionRepository = new TransactionRepository(database);

const CONSULTOR_CODE = '522953';

module.exports = {
  create: async ({ body }) => {
    const f = async (transaction) => {
      const { is_consultant: isConsultant, type: codeType } = body;
      const confirmationCodeRequestedAt = moment().tz('America/Sao_Paulo').toISOString();
      const confirmationCode = isConsultant
        ? CONSULTOR_CODE : Math.floor(100000 + Math.random() * 900000);

      const phone = {
        phoneCountryCode: body.phone_country_code,
        phoneAreaCode: body.phone_area_code,
        phoneNumber: body.phone_number,
      };
      const { id: userGroup } = await userGroupRepository.findOneName(['id'], 'default', transaction);
      const [user, created] = await userRepository.findOrCreate({
        phone,
        confirmationCode,
        confirmationCodeRequestedAt,
        userGroup,
        codeType,
      },
      transaction);

      if (confirmationCodeExpired(user.confirmation_code_requested_at) && !created) {
        throw new Error(reuseLastCode);
      }
      if (!created) {
        await userRepository.updateConfirmationCode({
          userId: user.id,
          confirmationCode,
          confirmationCodeRequestedAt,
          codeType,
        },
        transaction);
      }
      if (!isConsultant) {
        await sendConfirmationCode(confirmationCode, phone, codeType);
      }
      if (created) {
        return httpResponse(201);
      }
      return httpResponse(204);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      if ([21211, 63003].includes(err.code)) {
        return httpResponse(400, { message: invalidPhoneNumber });
      }
      if (err.message === reuseLastCode) return httpResponse(403, { message: reuseLastCode });
      return throwError(err, 'users/create');
    }
  },
};
