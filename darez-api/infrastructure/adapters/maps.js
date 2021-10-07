const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  formatter: null,
};

module.exports = {
  geocoder: NodeGeocoder(options),
};
