const slackBot = require('../../../infrastructure/implementations/slack');
const { SLACK_ERR } = require('../helpers/strings/slackChannel');

module.exports = async (channel, message, from = '') => {
  try {
    if (slackBot !== null) {
      const content = (channel === SLACK_ERR)
        ? `${from} => ${(message.stack) ? message.stack.toString() : message.toString()}`
        : message.toString();
      if (process.env.NODE_ENV === 'production') await slackBot(channel, content);
      else if (process.env.NODE_ENV === 'develop') {
        const channeldev = 'develop-';
        await slackBot(channeldev.concat(channel), content);
      }
    }
  } catch (err) {
    /* eslint-disable */
    console.log(err);
  }
};
