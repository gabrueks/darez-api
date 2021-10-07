const Boom = require('@hapi/boom');
const consultorCodes = require('./consultorCodes');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const UserRepository = require('../../../infrastructure/repositories/user');

const companyRepository = new CompanyRepository(database);
const userRepository = new UserRepository(database);

module.exports = async (id, isUser, transaction = null) => {
  try {
    const response = (isUser)
      ? await userRepository.findUserLoginCode(id, transaction)
      : await companyRepository.findUserLoginCode(id, transaction);
    if (response.User) {
      const { confirmation_code: confirmationCode, full_name: fullName } = response.User;
      return consultorCodes[confirmationCode] ? consultorCodes[confirmationCode] : fullName;
    }
    const { confirmation_code: confirmationCode, full_name: fullName } = response;
    return consultorCodes[confirmationCode] ? consultorCodes[confirmationCode] : fullName;
  } catch (error) {
    throw Boom.internal(error.message);
  }
};
