const axios = require('axios');
const createClient = require('./create_client');
const createAccount = require('./create_account');
const createPayment = require('./create_payment');
const refundPayment = require('./refund_payment');
const checkBalance = require('./check_balance');
const createTransfer = require('./create_transfer');

const asaasApi = axios.create({
  baseURL: process.env.ASAAS_URL,
  timeout: 60 * 0.2 * 1000,
});

module.exports = {
  createClient,
  createAccount,
  createPayment,
  refundPayment,
  checkBalance,
  createTransfer,
  asaasApi,
};
