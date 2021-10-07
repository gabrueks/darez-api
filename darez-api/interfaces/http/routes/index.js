const docs = require('./docs');
const users = require('./users');
const login = require('./login');
const companies = require('./companies');
const products = require('./products');
const healthcheck = require('./healthcheck');
const sms = require('./sms');
const orders = require('./orders');
const categories = require('./categories');
const search = require('./search');
const groups = require('./groups');
const promotions = require('./promotions');
const payments = require('./payments');
const home = require('./home');
const businesshours = require('./businesshours');
const buildRoutes = require('./buildRoutes');
const consultant = require('./consultant');
const clients = require('./clients');
const sales = require('./sales');
const reports = require('./reports');

module.exports = [
  healthcheck,
  docs,
  users,
  login,
  sms,
  companies,
  orders,
  products,
  categories,
  search,
  groups,
  promotions,
  payments,
  home,
  businesshours,
  buildRoutes,
  consultant,
  clients,
  sales,
  reports,
];
