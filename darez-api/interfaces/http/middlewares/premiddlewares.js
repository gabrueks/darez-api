const { json } = require('express');
const cors = require('cors');
const helmet = require('helmet');

module.exports = [
  cors(),
  json(),
  helmet(),
];
