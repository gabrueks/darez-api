const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const {
  confirmationCodeExpired, sendConfirmationCode, invalidPhoneNumber,
  reuseLastCode, throwError, unexistentUser,
} = require('../helpers');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');

const userRepository = new UserRepository(database);
const transactionRepository = new TransactionRepository(database);

const CONSULTOR_CODE = '522953';

module.exports = {
  authLogin: async ({ body }) => {
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
      const user = await userRepository.findOneFromPhone(phone, transaction);

      if (!user) return httpResponse(400, { message: unexistentUser });

      if (confirmationCodeExpired(user.confirmation_code_requested_at)) {
        throw new Error(reuseLastCode);
      }
      await userRepository.updateConfirmationCode({
        userId: user.id,
        confirmationCode,
        confirmationCodeRequestedAt,
        codeType,
      },
      transaction);

      if (!isConsultant) {
        await sendConfirmationCode(confirmationCode, phone, codeType);
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
      return throwError(err, 'login/authLogin');
    }
  },
};
