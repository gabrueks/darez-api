const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const BusinessHoursRepository = require('../../../infrastructure/repositories/business_hours');
const CompanyPaymentRepository = require('../../../infrastructure/repositories/company_payment');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const UserRepository = require('../../../infrastructure/repositories/user');
const UserGroupRepository = require('../../../infrastructure/repositories/user_group');
const coordinates = require('../../../infrastructure/implementations/coordinates');
const {
  createSchedule, buildEndpointValue, findCreator, createUpdateCompanyBuilder, generateLoginToken,
  slackChannel: { SLACK_COMPANIES }, paymentMethods: { CASH, DEBIT, CREDIT },
  newCompanySlackString, sendWelcomeCompany, throwError, defaultTokenExp,
} = require('../helpers');

const { toSlack } = require('../slack');
const { updateToken } = require('../analytics');

const companyRepository = new CompanyRepository(database);
const companyPaymentRepository = new CompanyPaymentRepository(database);
const businessHoursRepository = new BusinessHoursRepository(database);
const transactionRepository = new TransactionRepository(database);
const userRepository = new UserRepository(database);
const userGroupRepository = new UserGroupRepository(database);

module.exports = {
  create: async ({ body, userId, headers }) => {
    const f = async (transaction) => {
      const { fantasy_name: fantasyName, schedule } = body;
      const { latitude, longitude } = await coordinates({ ...body });
      const processedSchedule = createSchedule(schedule);

      const creator = await findCreator(userId, true, transaction);
      const endpoint = await buildEndpointValue(fantasyName, transaction);
      const company = createUpdateCompanyBuilder(
        body, creator, latitude, longitude, userId, endpoint,
      );
      const { dataValues: { id: companyId } } = await companyRepository
        .create(company, transaction);
      await businessHoursRepository.createOrUpdate(processedSchedule, companyId, transaction);
      await companyPaymentRepository.create(companyId, CASH, transaction);
      await companyPaymentRepository.create(companyId, DEBIT, transaction);
      await companyPaymentRepository.create(companyId, CREDIT, transaction);
      const { id: userGroup } = await userGroupRepository.findOneName(['id'], 'company_owner', transaction);
      await userRepository.update({ user_group: userGroup }, userId, transaction);
      const user = await userRepository.findOne(userId, ['full_name', 'phone_country_code', 'phone_area_code', 'phone_number'], transaction);
      const accessToken = generateLoginToken({ userId, companyId }, defaultTokenExp);
<<<<<<< HEAD
      await userRepository.update({ access_token: accessToken }, userId, transaction);
=======
      await userRepository.update({ web_access_token: accessToken, app_access_token: accessToken },
        userId, transaction);
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      toSlack(SLACK_COMPANIES, newCompanySlackString(body, user.full_name, endpoint, creator));
      sendWelcomeCompany({
        phoneCountryCode: user.phone_country_code,
        phoneAreaCode: user.phone_area_code,
        phoneNumber: user.phone_number,
      }, user.full_name, endpoint);
      updateToken(headers, accessToken);
      return httpResponse(201, {
        access_token: accessToken, user_group: userGroup,
      });
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (error) {
      return throwError(error, 'companies/create');
    }
  },
};
