const { Router } = require('express');
const {
  indexCompanies, searchCompanies, clearCompanies, indexProducts, searchProducts, clearProducts,
} = require('../../../web/v1/search');
const { SearchSchema } = require('../../../web/v1/schemas');
const { validate } = require('../middlewares');

module.exports = Router()
  .get('/search/index/companies', async (req, res) => {
    const { statusCode, data } = await indexCompanies();
    return res.status(statusCode).json(data);
  })
  .post('/search/companies/:search', validate(SearchSchema), async (req, res) => {
    const { statusCode, data } = await searchCompanies(req);
    return res.status(statusCode).json(data);
  })
  .get('/search/clear/companies', async (req, res) => {
    const { statusCode, data } = await clearCompanies();
    return res.status(statusCode).json(data);
  })
  .get('/search/index/products', async (req, res) => {
    const { statusCode, data } = await indexProducts();
    return res.status(statusCode).json(data);
  })
  .post('/search/products/:search', validate(SearchSchema), async (req, res) => {
    const { statusCode, data } = await searchProducts(req);
    return res.status(statusCode).json(data);
  })
  .get('/search/clear/products', async (req, res) => {
    const { statusCode, data } = await clearProducts();
    return res.status(statusCode).json(data);
  });
