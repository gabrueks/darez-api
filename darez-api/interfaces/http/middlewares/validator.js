const Boom = require('@hapi/boom');

const validator = (schema, body) => {
  const { error } = schema.validate(body);

  if (error) {
    throw Boom.badRequest(error.message);
  }
};

module.exports = {
  validate: (schema) => (req, _res, next) => {
    validator(schema, req.body);
    return next();
  },

  validateParams: (schema) => (req, _res, next) => {
    validator(schema, req.params);
    return next();
  },
};
