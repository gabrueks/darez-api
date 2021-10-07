const findCategories = require('./findCategories');
const findSubcategoriesCategory = require('./findSubcategoriesCategory');

module.exports = {
  ...findCategories,
  ...findSubcategoriesCategory,
};
