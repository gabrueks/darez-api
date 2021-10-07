const { Router } = require('express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const { getShopHours } = require('../../../web/v1/businesshours');

module.exports = Router()
  .get('/companies/:ID/open', async (req, res) => {
    const { statusCode, data } = await getShopHours(httpRequest(req));
    return res.status(statusCode).json(data);
  });
