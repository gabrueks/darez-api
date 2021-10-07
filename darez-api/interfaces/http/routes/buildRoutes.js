const { Router } = require('express');
const { buildRoute } = require('../../../web/v1/build');

module.exports = Router()
  .get('/build', async (req, res) => {
    const { statusCode, data } = await buildRoute();
    return res.status(statusCode).json(data);
  });
