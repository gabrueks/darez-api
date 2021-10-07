const { Router } = require('express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const { getBanners } = require('../../../web/v1/home');

module.exports = Router()
  .get('/home/banners', async (req, res) => {
    const { statusCode, data } = await getBanners(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/home/banners/mainbanner', async (req, res) => {
    const { statusCode, data } = await getBanners(httpRequest(req), true);
    return res.status(statusCode).json(data);
  });
