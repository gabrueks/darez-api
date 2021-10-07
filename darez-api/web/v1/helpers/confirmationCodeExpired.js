const moment = require('moment-timezone');
const differenceBetweenDates = require('./differenceBetweenDates');

module.exports = (confirmationCodeRequestedAt) => {
  const waitTime = 1; // Minutes
  const diffTime = differenceBetweenDates(moment().tz('America/Sao_Paulo'), moment(confirmationCodeRequestedAt).tz('America/Sao_Paulo'));
  // Quando for de fato implementar isso, basta trocar esse if para return true
  if (diffTime < waitTime * 60) return false;
  return false;
};
