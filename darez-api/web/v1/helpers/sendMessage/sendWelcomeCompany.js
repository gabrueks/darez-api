const sender = require('./sender');
const { welcomeCompanyString } = require('../strings');

module.exports = async (phone, fullName, endpoint) => {
  const phoneNumber = phone.phoneCountryCode + phone.phoneAreaCode + phone.phoneNumber;
  const welcome = welcomeCompanyString(fullName, endpoint);
  return sender(welcome, phoneNumber, 'WTS');
};
