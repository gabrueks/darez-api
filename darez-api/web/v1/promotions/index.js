const create = require('./create');
const update = require('./update');
const logicalDelete = require('./logicalDelete');
const scheduleDelete = require('./scheduleDelete');
const findAllFromCompany = require('./findAllFromCompany');
const findOne = require('./findOne');
const findAllRegion = require('./findAllRegion');

module.exports = {
  ...create,
  ...update,
  ...logicalDelete,
  ...findAllFromCompany,
  ...findOne,
  ...findAllRegion,
  ...scheduleDelete,
};
