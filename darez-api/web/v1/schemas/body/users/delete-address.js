const Joi = require('joi');

module.exports = {
  DeleteUserAddressSchema: Joi.object({
    addresses: Joi.array().min(1).items(Joi.number()).required(),
  }).required(),
};
