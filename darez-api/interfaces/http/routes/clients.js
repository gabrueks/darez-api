const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const {
  create, getOne, getAllCompany, update, getAllSales, deleteOne,
} = require('../../../web/v1/clients');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  authenticate, authorize, validate, validateParams,
} = require('../middlewares');
const {
  NewClientSchema, getOneClientSchema, UpdateClientSchema, updateOneClientParamsSchema,
  getClientSalesSchema,
} = require('../../../web/v1/schemas');

module.exports = Router()
  .post('/clients', wrap(authenticate), wrap(authorize('post_client')), validate(NewClientSchema), async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/clients', wrap(authenticate), wrap(authorize('get_all_client')), async (req, res) => {
    const { statusCode, data } = await getAllCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/clients/:ID', wrap(authenticate), wrap(authorize('get_one_client')), validateParams(getOneClientSchema), async (req, res) => {
    const { statusCode, data } = await getOne(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/clients/:ID', wrap(authenticate), wrap(authorize('put_client')), validateParams(updateOneClientParamsSchema), validate(UpdateClientSchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/clients/:ID/sales', wrap(authenticate), wrap(authorize('get_all_sales_client')), validateParams(getClientSalesSchema), async (req, res) => {
    const { statusCode, data } = await getAllSales(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/clients/:ID', wrap(authenticate), wrap(authorize('delete_client')), async (req, res) => {
    const { statusCode, data } = await deleteOne(httpRequest(req));
    return res.status(statusCode).json(data);
  });
