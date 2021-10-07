const { twilioClient } = require('../../../../infrastructure/adapters/twilio');
const { toSlack } = require('../../slack');
const { slackChannel: { SLACK_ERR } } = require('../strings');
const TwilioImplementation = require('../../../../infrastructure/implementations/twilio');

const twilioImplementation = new TwilioImplementation(twilioClient);

const { NODE_ENV } = process.env;

module.exports = async (message, phone, type) => {
  if (NODE_ENV === 'production') await twilioImplementation.sendMessage(message, phone, type);
  else await toSlack(SLACK_ERR, message, 'INFO');
  return true;
};
