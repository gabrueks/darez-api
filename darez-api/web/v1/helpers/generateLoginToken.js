const jwt = require('jsonwebtoken');
const generateApiKey = require('./generateApiKey');

const { JWT_SECRET_KEY } = process.env;

module.exports = (user, expirationTime) => {
  const iat = Date.now();
  const apikey = generateApiKey(user.userId, iat);
  return jwt.sign({
    data: {
      user_id: user.userId,
      company_id: user.companyId,
    },
    iat,
    api_key: apikey,
  }, JWT_SECRET_KEY, { expiresIn: expirationTime });
};
