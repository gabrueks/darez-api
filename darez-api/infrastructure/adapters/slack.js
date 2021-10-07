const SlackBot = require('slackbots');

const {
  SLACK_TOKEN,
} = process.env;
const bot = (SLACK_TOKEN !== '') ? new SlackBot({
  token: SLACK_TOKEN,
  name: 'doladobot',
}) : null;

module.exports = {
  bot,
};
