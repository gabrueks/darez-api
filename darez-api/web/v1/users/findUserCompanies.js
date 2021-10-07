const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const userRepository = new UserRepository(database);
const companyRepository = new CompanyRepository(database);

module.exports = {
  findUserCompanies: async ({ userId }) => {
    try {
      const resultUser = await userRepository.findOne(userId, ['id', 'full_name']);
      const resultCompany = await companyRepository.findCompanyFromUser(userId);
      if (resultCompany) {
        resultUser.company = resultCompany;
      }
      return httpResponse(200, resultUser);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/findUserCompanies');
      return httpResponse(500);
    }
  },
};
