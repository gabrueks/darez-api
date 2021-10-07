const Joi = require('joi');

module.exports = {
  UpdateCompanySchema: Joi.object({
    user_id: Joi.number(),
    cep: Joi.string().min(8).max(8).pattern(/[0-9]+/),
    state: Joi.string().alphanum().case('upper').max(2),
    city: Joi.string().max(50),
    street: Joi.string().max(200),
    street_number: Joi.number(),
    address_2: Joi.string().max(20).allow(null).allow(''),
    neighborhood: Joi.string().max(200),
    delivery_range: Joi.number().min(1),
    fantasy_name: Joi.string().max(255),
    document: Joi.string().min(11).max(14).pattern(/[0-9]+/),
    phone_country_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/),
    phone_area_code: Joi.string().min(2).max(3).pattern(/^[0-9]+$/),
    phone_number: Joi.string().min(8).max(9).pattern(/^[0-9]+$/),
    schedule: Joi.array().items({
      day: Joi.number().min(1).max(7).required(),
      open_time: Joi.string().pattern(/[0-2][0-9]:[0-5][0-9]/).required(),
      close_time: Joi.string().pattern(/[0-2][0-9]:[0-5][0-9]/).required(),
    }),
    category: Joi.string(),
    created_by: Joi.string().max(255),
    facebook_url: Joi.string().max(255),
    instagram_url: Joi.string().max(255),
  }).required(),
};
