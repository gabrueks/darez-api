const searchCompanies = require('./searchCompanies');
const searchCompaniesIndex = require('./searchCompanyIndex');
const searchCompaniesClean = require('./searchCompanyClean');
const searchProducts = require('./searchProducts');
const searchProductsIndex = require('./searchProductsIndex');
const searchProductsClean = require('./searchProductsClean');

module.exports = {
  ...searchCompanies,
  ...searchCompaniesIndex,
  ...searchCompaniesClean,
  ...searchProducts,
  ...searchProductsIndex,
  ...searchProductsClean,
};
