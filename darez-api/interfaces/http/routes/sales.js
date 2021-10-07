const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const {
  create, findAllFromCompany, findOne, findAllDateRange, update,
  findAllMethods, deleteOne,
} = require('../../../web/v1/sales');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const { authenticate, authorize, validate } = require('../middlewares');
const { NewSaleSchema, UpdateSaleSchema } = require('../../../web/v1/schemas');

module.exports = Router()
  .post('/sales', wrap(authenticate), wrap(authorize('post_sale')), validate(NewSaleSchema), async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/sales/:ID', wrap(authenticate), wrap(authorize('update_sale')), validate(UpdateSaleSchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/sales', wrap(authenticate), wrap(authorize('get_sales_company')), async (req, res) => {
    const { statusCode, data } = await findAllFromCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/sales/range', wrap(authenticate), wrap(authorize('get_sales_range')), async (req, res) => {
    const { statusCode, data } = await findAllDateRange(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/sales/methods', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findAllMethods(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/sales/:ID', wrap(authenticate), wrap(authorize('get_sale')), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/sales/:ID', wrap(authenticate), wrap(authorize('delete_sale')), async (req, res) => {
    const { statusCode, data } = await deleteOne(httpRequest(req));
    return res.status(statusCode).json(data);
  });
