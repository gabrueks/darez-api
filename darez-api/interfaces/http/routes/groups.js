const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const { findOne } = require('../../../web/v1/userGroups');
const { authenticate } = require('../middlewares');

module.exports = Router()
  .get('/groups/:ID', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  });
