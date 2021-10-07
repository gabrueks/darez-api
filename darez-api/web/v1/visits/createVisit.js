const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { differenceBetweenDates } = require('../helpers');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyVisitRepository = require('../../../infrastructure/repositories/company_visit');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const companyVisitRepository = new CompanyVisitRepository(database);

module.exports = {
  createVisit: async ({ headers, body }) => {
    const { ipv4 } = headers;
    const { companyId } = body;
    const waitTime = 3; // Minutes
    try {
      const resultVisit = await companyVisitRepository.findOne({ ipv4, companyId });
      if (resultVisit) {
        const diffTime = differenceBetweenDates(moment().tz('America/Sao_Paulo'), moment(resultVisit.created_at).tz('America/Sao_Paulo'));
        if (diffTime < waitTime * 60) return httpResponse(204);
      }
      await companyVisitRepository.create({ ...body, ...headers });
      return httpResponse(201);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('CREATE NEW VISIT => ', err);
      toSlack(SLACK_ERR, err, 'visits/createVisit');
      return httpResponse(500);
    }
  },
};
