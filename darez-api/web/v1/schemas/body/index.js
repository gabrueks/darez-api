const companies = require('./companies');
const orders = require('./orders');
const product = require('./products');
const visit = require('./visits');
const users = require('./users');
const search = require('./search');
const promotion = require('./promotions');
const payments = require('./payments');
const login = require('./login');
const clients = require('./clients');
const sales = require('./sales');

module.exports = {
  ...companies,
  ...orders,
  ...product,
  ...visit,
  ...users,
  ...search,
  ...promotion,
  ...payments,
  ...login,
  ...clients,
  ...sales,
};
