/* eslint-disable */
const { Router } = require('express');
const { wrap } = require('@awaitjs/express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
const {
  create, update, findOne, findAll, findUserCompanies, findDocument, createAddress, updateAddress, findAllAddresses,
  deleteAddresses,
} = require('../../../web/v1/users');
const { authenticate, validate, authorize } = require('../middlewares');
const {
  UpdateUserSchema, CreateUserAddressSchema, UpdateUserAddressSchema, DeleteUserAddressSchema
} = require('../../../web/v1/schemas');

module.exports = Router()
  .get('/admin/users', wrap(authenticate), wrap(authorize('get_all_user')), async (req, res) => {
    const { statusCode, data } = await findAll(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/admin/users/:ID', wrap(authenticate), wrap(authorize('get_one_user')), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/admin/users/:ID', wrap(authenticate), wrap(authorize('update_user')), validate(UpdateUserSchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/users/company', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findUserCompanies(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/users', async (req, res) => {
    const { statusCode, data } = await create(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .put('/users', wrap(authenticate), validate(UpdateUserSchema), async (req, res) => {
    const { statusCode, data } = await update(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/users', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findOne(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/users/addresses', wrap(authenticate), validate(CreateUserAddressSchema), async (req, res) => {
    const { statusCode, data } = await createAddress(httpRequest(req));
    return res.status(statusCode).json(data)
  })
  .put('/users/addresses', wrap(authenticate), validate(UpdateUserAddressSchema), async (req, res) => {
    const { statusCode, data } = await updateAddress(httpRequest(req));
    return res.status(statusCode).json(data)
  })
  .get('/users/addresses', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findAllAddresses(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .delete('/users/addresses', wrap(authenticate), validate(DeleteUserAddressSchema), async (req, res) => {
    const { statusCode, data } = await deleteAddresses(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .get('/users/document/:DOCUMENT', wrap(authenticate), async (req, res) => {
    const { statusCode, data } = await findDocument(httpRequest(req));
    return res.status(statusCode).json(data);
  });


