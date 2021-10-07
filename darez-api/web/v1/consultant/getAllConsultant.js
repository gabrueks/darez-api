const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { consultorCodes } = require('../helpers');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

module.exports = {
  getAllConsultant: async () => {
    try {
      return httpResponse(200, { consultant: Object.values(consultorCodes) });
    } catch (error) {
      toSlack(SLACK_ERR, error, 'consultant/getAllConsultant');
      return httpResponse(500);
    }
  },
};
