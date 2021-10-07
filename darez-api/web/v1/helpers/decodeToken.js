const jwt = require('jsonwebtoken');

module.exports = (token) => {
  const { data } = jwt.decode(token);
  return data;
};
