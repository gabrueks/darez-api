const Joi = require('joi');

module.exports = {
  NewCompanySchema: Joi.object({
    cep: Joi.string().min(8).max(8).pattern(/[0-9]+/)
      .required(),
    state: Joi.string().alphanum().case('upper').max(2)
      .required(),
    city: Joi.string().max(50).required(),
    street: Joi.string().max(200).required(),
    street_number: Joi.number().required(),
    address_2: Joi.string().max(20).allow(null).allow(''),
    neighborhood: Joi.string().max(200).required(),
    fantasy_name: Joi.string().max(255).required(),
    document: Joi.string().min(11).max(14).pattern(/[0-9]+/)
      .required(),
    phone_country_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/)
      .required(),
    phone_area_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/)
      .required(),
    phone_number: Joi.string().min(8).max(9).pattern(/^[0-9]+$/)
      .required(),
    schedule: Joi.array().items({
      day: Joi.number().min(1).max(7).required(),
      open_time: Joi.string().pattern(/[0-2][0-9]:[0-5][0-9]/).required(),
      close_time: Joi.string().pattern(/[0-2][0-9]:[0-5][0-9]/).required(),
    }),
    category: Joi.string(),
  }).required(),
};
