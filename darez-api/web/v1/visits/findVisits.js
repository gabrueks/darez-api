const moment = require('moment-timezone');

const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyVisitRepository = require('../../../infrastructure/repositories/company_visit');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyVisitRepository = new CompanyVisitRepository(database);

module.exports = {
  findVisits: async ({ query, companyId }) => {
    const {
      companies, before, after,
    } = query;
    try {
      const resultVisit = await companyVisitRepository.findAll(
        companies ? JSON.parse(companies) : [companyId],
        before ? moment(before).tz('America/Sao_Paulo') : null,
        after ? moment(after).tz('America/Sao_Paulo') : null,
      );
      return httpResponse(200, resultVisit);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'visits/findVisits');
      // eslint-disable-next-line no-console
      console.log('findVisits => ', err);
      return httpResponse(500);
    }
  },
};
