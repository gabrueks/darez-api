const Joi = require('joi');

module.exports = {
  NewPromotionSchema: Joi.object({
    discount: Joi.number().precision(2).required(),
    has_limit_date: Joi.boolean().required(),
    date_start: Joi.when('has_limit_date', {
      is: true,
      then: Joi.string().max(10).pattern(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/).required(),
      otherwise: Joi.string().max(10).pattern(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/).allow(null),
    }),
    date_end: Joi.when('has_limit_date', {
      is: true,
      then: Joi.string().max(10).pattern(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/).required(),
      otherwise: Joi.string().max(10).pattern(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/).allow(null),
    }),
    products: Joi.array().items(
      Joi.object({
        id: Joi.number().required(),
        promotion_price: Joi.number().precision(2).required(),
      }).required(),
    ).required(),
  }).required(),
};
