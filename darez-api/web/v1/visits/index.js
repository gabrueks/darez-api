const createVisit = require('./createVisit');
const findVisits = require('./findVisits');

module.exports = {
  ...createVisit,
  ...findVisits,
};
