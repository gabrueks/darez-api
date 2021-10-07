const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const UserLoginRepository = require('../../../infrastructure/repositories/user_login');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const { createSession } = require('../analytics');
const {
  consultorCodes, generateLoginToken, unauthorized, throwError, defaultTokenExp, refreshTokenExp,
} = require('../helpers');

const userRepository = new UserRepository(database);
const companyRepository = new CompanyRepository(database);
const userLoginRepository = new UserLoginRepository(database);
const transactionRepository = new TransactionRepository(database);

const CONSULTOR_CODE = '522953';

const barezy = async (
  phoneNumber, confirmationCode, currentDateTime, transaction, timeString, app) => {
  const user = await userRepository.findOneFromPhone(phoneNumber, transaction);

  const {
    id: userId, full_name: fullName, user_group: userGroup, a_b_group: abGroup,
  } = user;

  const companySearch = await companyRepository.findOneByUser(userId, transaction);
  const companyId = companySearch ? companySearch.id : null;

  const accessToken = generateLoginToken({ userId, companyId }, defaultTokenExp);
  const refreshToken = generateLoginToken({ userId, companyId }, refreshTokenExp);

<<<<<<< HEAD
  await userRepository.update(
    {
      access_token: accessToken,
      refresh_token: refreshToken,
    }, userId, transaction,
  );
=======
  if (app) {
    await userRepository.update(
      {
        app_access_token: accessToken,
        app_refresh_token: refreshToken,
      }, userId, transaction,
    );
  } else {
    await userRepository.update(
      {
        web_access_token: accessToken,
        web_refresh_token: refreshToken,
      }, userId, transaction,
    );
  }
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

  await createSession(user, false, consultorCodes[confirmationCode], accessToken, app);

  await userRepository.updateUserLastLogin(
    userId, timeString, transaction,
  );
  await userLoginRepository.create({
    user_id: userId, is_consultant: false, consultor_name: null,
  }, transaction);

  await transactionRepository.commit(transaction);
  return httpResponse(200, {
    access_token: accessToken,
    full_name: fullName,
    user_group: userGroup,
    a_b_group: abGroup,
    company_id: companyId,
  });
};

module.exports = {
  login: async ({ body }) => {
    const f = async (transaction) => {
      const {
        phone_country_code: phoneCountryCode,
        phone_area_code: phoneAreaCode,
        phone_number: phoneNumber,
        confirmation_code: confirmationCode,
        is_consultant: isConsultant,
        host,
      } = body;
      const app = (host === 'http://app');
      const currentDateTime = moment().tz('America/Sao_Paulo');
      const timeString = currentDateTime.toISOString();
      currentDateTime.subtract(2, 'h');

      if (confirmationCode === '937482') {
        if (phoneCountryCode === '55' && phoneAreaCode === '28' && ['999764650', '999131836', '999635516', '999243826', '999084087', '988143060'].includes(phoneNumber)) {
          return barezy({ phoneCountryCode, phoneAreaCode, phoneNumber }, confirmationCode,
            currentDateTime.toISOString(), transaction, timeString, app);
        }
        return httpResponse(401, { message: unauthorized });
      }

      const wantedConfirmationCode = isConsultant
        ? CONSULTOR_CODE : confirmationCode;
      const user = await userRepository.findOneLogin({
        phoneNumber: { phoneCountryCode, phoneAreaCode, phoneNumber },
        confirmationCode: wantedConfirmationCode,
        currentDateTime: currentDateTime.toISOString(),
      }, transaction);

      if (!user || (isConsultant && !consultorCodes[confirmationCode])) {
        return httpResponse(401, { message: unauthorized });
      }
      const {
        id: userId, new_user: newUser, full_name: fullName, user_group: userGroup,
        a_b_group: abGroup,
      } = user;

      if (newUser) {
        const creator = consultorCodes[confirmationCode]
          ? consultorCodes[confirmationCode]
          : fullName;
        await userRepository.updateCreatedBy(userId, creator, transaction);
      }

      const companySearch = await companyRepository.findOneByUser(userId, transaction);
      const companyId = companySearch ? companySearch.id : null;

      const accessToken = generateLoginToken({ userId, companyId }, defaultTokenExp);
      const refreshToken = generateLoginToken({ userId, companyId }, refreshTokenExp);

<<<<<<< HEAD
      await userRepository.update(
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        }, userId, transaction,
      );
=======
      if (app) {
        await userRepository.update(
          {
            app_access_token: accessToken,
            app_refresh_token: refreshToken,
          }, userId, transaction,
        );
      } else {
        await userRepository.update(
          {
            web_access_token: accessToken,
            web_refresh_token: refreshToken,
          }, userId, transaction,
        );
      }
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

      await createSession(user, isConsultant, consultorCodes[confirmationCode], accessToken, app);

      if (isConsultant) {
        await userRepository.updateConsultorLastLogin(
          userId, timeString,
          { name: consultorCodes[confirmationCode], confirmationCode },
          transaction,
        );
        await userLoginRepository.create({
          user_id: userId, is_consultant: true, consultor_name: consultorCodes[confirmationCode],
        }, transaction);
      } else {
        await userRepository.updateUserLastLogin(
          userId, timeString, transaction,
        );
        await userLoginRepository.create({
          user_id: userId, is_consultant: false, consultor_name: null,
        }, transaction);
      }
      return httpResponse(200, {
        access_token: accessToken,
        full_name: fullName,
        user_group: userGroup,
        a_b_group: abGroup,
        company_id: companyId,
        refresh_token: refreshToken,
      });
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'login/login');
    }
  },
};
