const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const { unauthorized } = require('../../../../web/v1/helpers');

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  authenticate: async (req, _res, next) => {
    try {
      const { data: { user_id: userId, company_id: companyId } } = jwt.verify(
        req.headers.authorization.substring(0, 6) === 'Bearer'
          ? req.headers.authorization.split(' ')[1] : req.headers.authorization,
        JWT_SECRET_KEY,
      );
      req.userId = userId;
      req.companyId = companyId;
      return next();
    } catch (err) {
      throw Boom.unauthorized(unauthorized);
    }
  },
};
