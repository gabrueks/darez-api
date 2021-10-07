const create = require('./create');
const updateStatus = require('./updateStatus');
const findAllFromCompany = require('./findAllFromCompany');
const findOne = require('./findOne');
const findAllFromUser = require('./findAllFromUser');

module.exports = {
  ...create,
  ...updateStatus,
  ...findAllFromCompany,
  ...findOne,
  ...findAllFromUser,
};
