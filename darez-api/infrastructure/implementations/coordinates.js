const concatAddr = require('./helpers/concatAddr');
const { geocoder } = require('../adapters/maps');

module.exports = async (address) => {
  const addr = concatAddr(address);
  const [results] = await geocoder.geocode(addr);
  const { latitude, longitude } = results;
  return { latitude, longitude };
};
