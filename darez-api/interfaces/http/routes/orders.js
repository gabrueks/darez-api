const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  create, updateStatus, findAllFromCompany, findOne, findAllFromUser,
} = require('../../../web/v1/orders');
const { authenticate, authorize, validate } = require('../middlewares');
const { NewOrderSchema, UpdateOrderStatusSchema } = require('../../../web/v1/schemas');

module.exports = Router()
  .post('/orders', wrap(authenticate), validate(NewOrderSchema), async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/orders/company', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findAllFromCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/orders/user', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findAllFromUser(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/admin/orders/company/:ID', wrap(authenticate), wrap(authorize('get_company_orders')), async (req, res) => {
    const { statusCode, data } = await findAllFromCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/admin/orders/user/:ID', wrap(authenticate), wrap(authorize('get_user_orders')), async (req, res) => {
    const { statusCode, data } = await findAllFromUser(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/orders/:ID/status', wrap(authenticate), validate(UpdateOrderStatusSchema), async (req, res) => {
    const { statusCode, data } = await updateStatus(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/orders/:ID', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/admin/orders/:ID', wrap(authenticate), wrap(authorize('get_one_order')), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  });
