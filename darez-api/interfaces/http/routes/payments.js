const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  createAccount, createPayment, checkBalance, createTransfer,
} = require('../../../web/v1/payments');
const { authenticate, validate, authorize } = require('../middlewares');
const { NewPaymentSchema, NewTransferSchema } = require('../../../web/v1/schemas');

module.exports = Router()
  .post('/payments/companies', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await createAccount(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/payments', wrap(authenticate), validate(NewPaymentSchema), async (req, res) => {
    const { statusCode, data } = await createPayment(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/payments/balance', wrap(authenticate), wrap(authorize('get_asaas_balance')), async (req, res) => {
    const { statusCode, data } = await checkBalance(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/payments/transfers', wrap(authenticate), validate(NewTransferSchema), async (req, res) => {
    const { statusCode, data } = await createTransfer(httpRequest(req));
    return res.status(statusCode).json(data);
  });
