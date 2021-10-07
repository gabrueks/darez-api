const products = require('./products');
const clients = require('./clients');

module.exports = {
  ...products,
  ...clients,
};
