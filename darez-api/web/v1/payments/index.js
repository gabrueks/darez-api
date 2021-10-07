const createAccount = require('./createAccount');
const createPayment = require('./createPayment');
const checkBalance = require('./checkBalance');
const createTransfer = require('./createTransfer');

module.exports = {
  ...createAccount,
  ...createPayment,
  ...checkBalance,
  ...createTransfer,
};
