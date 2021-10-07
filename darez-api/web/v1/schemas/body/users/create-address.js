const Joi = require('joi');

module.exports = {
  CreateUserAddressSchema: Joi.object({
    cep: Joi.string().min(8).max(8).pattern(/[0-9]+/)
      .required(),
    state: Joi.string().alphanum().case('upper').max(2)
      .required(),
    city: Joi.string().max(50).required(),
    street: Joi.string().max(200).required(),
    street_number: Joi.number().required(),
    address_2: Joi.string().max(20).allow(null).allow(''),
    neighborhood: Joi.string().max(200).required(),
  }).required(),
};
