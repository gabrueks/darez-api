const create = require('./create');
const findAllFromCompany = require('./findAllFromCompany');
const findOne = require('./findOne');
const findAllDateRange = require('./findAllDateRange');
const update = require('./update');
const findAllMethods = require('./findAllMethods');
const deleteOne = require('./deleteOne');

module.exports = {
  ...create,
  ...findAllFromCompany,
  ...findOne,
  ...findAllDateRange,
  ...update,
  ...findAllMethods,
  ...deleteOne,
};
