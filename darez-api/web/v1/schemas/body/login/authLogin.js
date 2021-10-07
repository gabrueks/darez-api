const Joi = require('joi');

module.exports = {
  authLoginSchema: Joi.object({
    phone_country_code: Joi.string().min(2).max(2).required(),
    phone_area_code: Joi.string().min(2).max(4).required(),
    phone_number: Joi.string().min(8).max(9).required(),
    type: Joi.string().required(),
    is_consultant: Joi.boolean().required(),
  }).required(),
};
