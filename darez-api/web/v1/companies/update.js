const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const BusinessHoursRepository = require('../../../infrastructure/repositories/business_hours');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const coordinates = require('../../../infrastructure/implementations/coordinates');
const {
  createSchedule, findCreator, createUpdateCompanyBuilder, // buildEndpointValue,
  throwError,
} = require('../helpers');

const companyRepository = new CompanyRepository(database);
const businessHoursRepository = new BusinessHoursRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  update: async ({
    params, body, companyId, userId,
  }) => {
    const f = async (transaction) => {
      const id = (!params.ID) ? companyId : params.ID;
      const { schedule } = body;

      const creator = await findCreator(userId, true, transaction);
      // As 6 linhas seguintes de codigo sao responsaveis pela atualizacao de endpoint
      // quando o nome fantasia eh alterado.
      // const { fantasy_name: fantasyName } = await companyRepository.findOne(['fantasy_name'],
      // id, transaction);
      // if (body.fantasy_name && body.fantasy_name !== fantasyName) {
      //   // eslint-disable-next-line no-param-reassign
      //   body.endpoint = await buildEndpointValue(body.fantasy_name);
      // }
      if (body.street && body.cep && body.street_number && body.city && body.state) {
        const { latitude, longitude } = await coordinates({ ...body });
        const company = createUpdateCompanyBuilder(body, creator,
          latitude, longitude, null, null, true);
        await companyRepository.update(id, company, transaction);
      } else {
        const company = createUpdateCompanyBuilder(body, creator, null, null, null, null, true);
        await companyRepository.update(id, company, transaction);
      }
      if (schedule) {
        const processedSchedule = createSchedule(schedule);
        await businessHoursRepository.createOrUpdate(processedSchedule, id, transaction);
      }
      return httpResponse(204);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (error) {
      return throwError(error, 'companies/update');
    }
  },
};
