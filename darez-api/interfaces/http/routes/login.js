const { Router } = require('express');
const { httpRequest } = require('../../../infrastructure/adapters/http');
<<<<<<< HEAD
const { login, verify, refresh } = require('../../../web/v1/login');
const { validate } = require('../middlewares');
const {
  loginSchema, refreshSchema,
=======
const {
  login, verify, refresh, authLogin,
} = require('../../../web/v1/login');
const { validate } = require('../middlewares');
const {
  loginSchema, refreshSchema, authLoginSchema,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
} = require('../../../web/v1/schemas');

module.exports = Router()
  .post('/login', validate(loginSchema), async (req, res) => {
    const { statusCode, data } = await login(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/auth/login', validate(authLoginSchema), async (req, res) => {
    const { statusCode, data } = await authLogin(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/login/verify', async (req, res) => {
    const { statusCode, data } = await verify(httpRequest(req));
    return res.status(statusCode).json(data);
  })
  .post('/auth/refresh', validate(refreshSchema), async (req, res) => {
    const { statusCode, data } = await refresh(httpRequest(req));
    return res.status(statusCode).json(data);
  });
