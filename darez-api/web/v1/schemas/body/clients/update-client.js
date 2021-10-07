const Joi = require('joi');

module.exports = {
  UpdateClientSchema: Joi.object({
    name: Joi.string().min(1),
    phone_country_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/),
    phone_area_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/),
    phone_number: Joi.string().min(8).max(9).pattern(/^[0-9]+$/),
    email: Joi.string(),
  }).required(),
};
