const jwt = require('jsonwebtoken');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const {
  generateLoginToken, unauthorized, defaultTokenExp, refreshTokenExp,
} = require('../helpers');

const userRepository = new UserRepository(database);
const companyRepository = new CompanyRepository(database);

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  refresh: async ({ body }) => {
    try {
      const {
        refresh_token: usedRefreshToken,
        access_token: usedDefaultToken,
<<<<<<< HEAD
      } = body;
=======
        host,
      } = body;
      const app = (host === 'http://app');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

      jwt.verify(usedRefreshToken, JWT_SECRET_KEY);

      const userData = await userRepository.findOneTokenBased(
        usedDefaultToken, usedRefreshToken, ['id'],
      );
<<<<<<< HEAD
=======

>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      if (!userData) throw new Error();
      const userId = userData.id;

      const companyData = await companyRepository.findOneByUser(userId);
      const companyId = (!companyData) ? null : companyData.id;

      const accessToken = generateLoginToken({ userId, companyId }, defaultTokenExp);
      const refreshToken = generateLoginToken({ userId, companyId }, refreshTokenExp);

<<<<<<< HEAD
      await userRepository.update(
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        }, userId,
      );
=======
      if (app) {
        await userRepository.update(
          {
            app_access_token: accessToken,
            app_refresh_token: refreshToken,
          }, userId,
        );
      } else {
        await userRepository.update(
          {
            web_access_token: accessToken,
            web_refresh_token: refreshToken,
          }, userId,
        );
      }
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

      return httpResponse(200, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (err) {
      return httpResponse(401, { message: unauthorized });
    }
  },
};
