const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');
const { slackChannel: { SLACK_ERR } } = require('./strings');

module.exports = (error, place) => {
  // eslint-disable-next-line no-console
  console.error(`${place} => ${error}`);
  toSlack(SLACK_ERR, error, place);
  return httpResponse(500);
};
