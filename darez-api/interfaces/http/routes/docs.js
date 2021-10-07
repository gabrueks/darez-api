const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');

const user = require('../../../../docs/api/user.json');
const company = require('../../../../docs/api/company.json');
const product = require('../../../../docs/api/product.json');
const order = require('../../../../docs/api/order.json');
const group = require('../../../../docs/api/group.json');
const category = require('../../../../docs/api/category.json');
const search = require('../../../../docs/api/search.json');
const promotion = require('../../../../docs/api/promotion.json');
const payment = require('../../../../docs/api/payment.json');
const home = require('../../../../docs/api/home.json');
const build = require('../../../../docs/api/build.json');
const consultant = require('../../../../docs/api/consultant.json');
const client = require('../../../../docs/api/client.json');
const sale = require('../../../../docs/api/sale.json');
const report = require('../../../../docs/api/report.json');
const login = require('../../../../docs/api/login.json');

module.exports = Router()
  .use('/api-docs-user', swaggerUi.serveFiles(user))
  .get('/api-docs-user', (_, res) => res.send(swaggerUi.generateHTML(user)))
  .use('/api-docs-company', swaggerUi.serveFiles(company))
  .get('/api-docs-company', (_, res) => res.send(swaggerUi.generateHTML(company)))
  .use('/api-docs-product', swaggerUi.serveFiles(product))
  .get('/api-docs-product', (_, res) => res.send(swaggerUi.generateHTML(product)))
  .use('/api-docs-order', swaggerUi.serveFiles(order))
  .get('/api-docs-order', (_, res) => res.send(swaggerUi.generateHTML(order)))
  .use('/api-docs-group', swaggerUi.serveFiles(group))
  .get('/api-docs-group', (_, res) => res.send(swaggerUi.generateHTML(group)))
  .use('/api-docs-category', swaggerUi.serveFiles(category))
  .get('/api-docs-category', (_, res) => res.send(swaggerUi.generateHTML(category)))
  .use('/api-docs-search', swaggerUi.serveFiles(search))
  .get('/api-docs-search', (_, res) => res.send(swaggerUi.generateHTML(search)))
  .use('/api-docs-promotion', swaggerUi.serveFiles(promotion))
  .get('/api-docs-promotion', (_, res) => res.send(swaggerUi.generateHTML(promotion)))
  .use('/api-docs-payment', swaggerUi.serveFiles(payment))
  .get('/api-docs-payment', (_, res) => res.send(swaggerUi.generateHTML(payment)))
  .use('/api-docs-home', swaggerUi.serveFiles(home))
  .get('/api-docs-home', (_, res) => res.send(swaggerUi.generateHTML(home)))
  .use('/api-docs-build', swaggerUi.serveFiles(build))
  .get('/api-docs-build', (_, res) => res.send(swaggerUi.generateHTML(build)))
  .use('/api-docs-consultant', swaggerUi.serveFiles(consultant))
  .get('/api-docs-consultant', (_, res) => res.send(swaggerUi.generateHTML(consultant)))
  .use('/api-docs-client', swaggerUi.serveFiles(client))
  .get('/api-docs-client', (_, res) => res.send(swaggerUi.generateHTML(client)))
  .use('/api-docs-sale', swaggerUi.serveFiles(sale))
  .get('/api-docs-sale', (_, res) => res.send(swaggerUi.generateHTML(sale)))
  .use('/api-docs-report', swaggerUi.serveFiles(report))
  .get('/api-docs-report', (_, res) => res.send(swaggerUi.generateHTML(report)))
  .use('/api-docs-login', swaggerUi.serveFiles(login))
  .get('/api-docs-login', (_, res) => res.send(swaggerUi.generateHTML(login)));
