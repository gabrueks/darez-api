const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  create, updateImage, update, findPhotos, deleteImage, logicalDelete, findProductsSubcategory,
  findOne, deleteProdVariation, findProductVariations, findPreferences, sorting,
} = require('../../../web/v1/products');
const {
  validate, upload, authenticate, authorize, base64validate, resizeImageMiddleware, validateParams,
} = require('../middlewares');
const {
  NewProductSchema, DeleteProductImageSchema, UpdateProductSchema, DeleteProductVariationSchema,
  LogicalDeleteProductSchema, UpdateImageSchema, SortingSchema, getOneProductSchema,
} = require('../../../web/v1/schemas');
const {
  productHeight, productLength, productQuality,
} = require('../helpers');

module.exports = Router()
  .post('/products', wrap(authenticate), wrap(authorize('create_product')), validate(NewProductSchema), async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/products/:ID', wrap(authenticate), wrap(authorize('update_product')), validate(UpdateProductSchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/products', wrap(authenticate), wrap(authorize('delete_product')), validate(LogicalDeleteProductSchema), async (req, res) => {
    const { statusCode, data } = await logicalDelete(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/products/:ID', validateParams(getOneProductSchema), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/products/user/preferences', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findPreferences(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/products/:ID/images', async (req, res) => {
    const { statusCode, data } = await findPhotos(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/products/subcategory/companies/:ID', async (req, res) => {
    const { statusCode, data } = await findProductsSubcategory(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/products/:ID/variations', async (req, res) => {
    const { statusCode, data } = await findProductVariations(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/products/:ID/images', wrap(authenticate), wrap(authorize('update_product_image')), upload.array('files'), wrap(resizeImageMiddleware(productLength, productHeight, productQuality)), async (req, res) => {
    const { statusCode, data } = await updateImage(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/products/:ID/images', wrap(authenticate), wrap(authorize('delete_product_image')), validate(DeleteProductImageSchema), async (req, res) => {
    const { statusCode, data } = await deleteImage(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/products/:ID/variations', wrap(authenticate), wrap(authorize('delete_product_variation')), validate(DeleteProductVariationSchema), async (req, res) => {
    const { statusCode, data } = await deleteProdVariation(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/app/products/:ID/images', wrap(authenticate), wrap(authorize('update_product_image')), validate(UpdateImageSchema), wrap(base64validate), wrap(resizeImageMiddleware(productLength, productHeight, productQuality)), async (req, res) => {
    const { statusCode, data } = await updateImage(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/products/sorting', wrap(authenticate), wrap(authorize('swap_product')), validate(SortingSchema), async (req, res) => {
    const { statusCode, data } = await sorting(httpRequest(req));
    return res.status(statusCode).json(data);
  });
