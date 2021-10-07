const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { getAllConsultant } = require('../../../web/v1/consultant');
const { authenticate, authorize } = require('../middlewares');

module.exports = Router()
  .get('/consultant', wrap(authenticate), wrap(authorize('get_consultant')), async (_req, res) => {
    const { statusCode, data } = await getAllConsultant();
    return res.status(statusCode).json(data);
  });
