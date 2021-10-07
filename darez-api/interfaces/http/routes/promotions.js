const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  create, update, findAllFromCompany, findOne, logicalDelete, findAllRegion,
  scheduleDelete,
} = require('../../../web/v1/promotions');
const {
  validate, authenticate, authorize,
} = require('../middlewares');
const {
  NewPromotionSchema, UpdatePromotionSchema,
} = require('../../../web/v1/schemas');

module.exports = Router()
  .get('/promotions/geo-distance', async (req, res) => {
    const { statusCode, data } = await findAllRegion(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/promotions', wrap(authenticate), wrap(authorize('create_promotion')), validate(NewPromotionSchema), async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/promotions/schedule', async (req, res) => {
    const { statusCode, data } = await scheduleDelete(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/promotions/:ID', wrap(authenticate), wrap(authorize('update_promotion')), validate(UpdatePromotionSchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/promotions/:ID', wrap(authenticate), wrap(authorize('delete_promotion')), async (req, res) => {
    const { statusCode, data } = await logicalDelete(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/promotions/company/:ID', async (req, res) => {
    const { statusCode, data } = await findAllFromCompany(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/promotions/:ID', async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  });
