const create = require('./create');
const findOne = require('./findOne');
const findAll = require('./findAll');
const update = require('./update');
const createAddress = require('./createAddresses');
const updateAddress = require('./updateAddress');
const findAllAddresses = require('./findAllAddresses');
const findDocument = require('./findDocument');
const findUserCompanies = require('./findUserCompanies');
const deleteAddresses = require('./deleteAddresses');

module.exports = {
  ...create,
  ...update,
  ...findOne,
  ...findAll,
  ...findAllAddresses,
  ...createAddress,
  ...updateAddress,
  ...findDocument,
  ...findUserCompanies,
  ...deleteAddresses,
};
