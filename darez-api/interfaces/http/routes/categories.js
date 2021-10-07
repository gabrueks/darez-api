const { Router } = require('express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const { findCategories, findSubcategoriesCategory } = require('../../../web/v1/categories');

module.exports = Router()
  .get('/categories', async (req, res) => {
    const { statusCode, data } = await findCategories(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/categories/:category/subcategories', async (req, res) => {
    const { statusCode, data } = await findSubcategoriesCategory(httpRequest(req));
    return res.status(statusCode).json(data);
  });
