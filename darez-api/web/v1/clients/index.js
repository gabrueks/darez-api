const create = require('./create');
const getOne = require('./getOne');
const getAllCompany = require('./getAllCompany');
const update = require('./update');
const getAllSales = require('./getAllSales');
const deleteOne = require('./deleteOne');

module.exports = {
  ...create,
  ...getOne,
  ...getAllCompany,
  ...update,
  ...getAllSales,
  ...deleteOne,
};
