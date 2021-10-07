const { bot } = require('../adapters/slack');

module.exports = async (channel, message) => {
  await bot.postMessageToChannel(channel, message);
};
