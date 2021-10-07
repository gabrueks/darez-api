const jwt = require('jsonwebtoken');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { unauthorized } = require('../helpers/strings');

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  verify: ({ body }) => {
    try {
      const { data } = jwt.verify(body.token, JWT_SECRET_KEY);
      return httpResponse(200, {
        user_id: data.user_id,
        company_id: data.company_id,
      });
    } catch (err) {
      return httpResponse(401, { message: unauthorized });
    }
  },
};
