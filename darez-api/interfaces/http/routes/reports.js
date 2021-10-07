const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { kadernet } = require('../../../web/v1/reports');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const { authenticate, authorize } = require('../middlewares');

module.exports = Router()
  .get('/reports/sales', wrap(authenticate), wrap(authorize('get_reports_kadernet')), async (req, res) => {
    const { statusCode, data } = await kadernet(httpRequest(req));
    return res.status(statusCode).json(data);
  });
