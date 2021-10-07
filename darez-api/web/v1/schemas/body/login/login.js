const Joi = require('joi');

module.exports = {
  loginSchema: Joi.object({
    phone_country_code: Joi.string().min(2).max(2).required(),
    phone_area_code: Joi.string().min(2).max(4).required(),
    phone_number: Joi.string().min(8).max(9).required(),
    confirmation_code: Joi.string().min(6).max(6).required(),
    is_consultant: Joi.boolean().required(),
    host: Joi.string(),
  }).required(),
};
