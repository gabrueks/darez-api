const sender = require('./sender');
const { newSaleString } = require('../strings');

module.exports = async (userName, orderId, products, totalPrice, paymentMethod, change, observations = '-', address, phoneNumber, date, time, phone, sendMethod) => {
  const completePhoneNumber = phone.phoneCountryCode + phone.phoneAreaCode + phone.phoneNumber;
  return sender(newSaleString(
    userName, orderId, products, totalPrice, paymentMethod, change, observations, address,
    phoneNumber, date, time,
  ),
  completePhoneNumber, sendMethod);
};
