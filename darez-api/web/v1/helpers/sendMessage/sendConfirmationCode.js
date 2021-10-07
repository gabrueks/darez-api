const sender = require('./sender');

module.exports = async (confirmationCode, phone, type) => {
  const phoneNumber = phone.phoneCountryCode + phone.phoneAreaCode + phone.phoneNumber;
  return sender(`Seu código de acesso é: ${confirmationCode}`, phoneNumber, type);
};
