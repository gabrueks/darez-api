const Joi = require('joi');

module.exports = {
  NewClientSchema: Joi.object({
    name: Joi.string().min(1).required(),

    phone_country_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/)
      .required(),
    phone_area_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/)
      .required(),
    phone_number: Joi.string().min(8).max(9).pattern(/^[0-9]+$/)
      .required(),

    email: Joi.string(),
  }).required(),
};
