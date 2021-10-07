const Joi = require('joi');

module.exports = {
  NewPaymentSchema: Joi.object({
    order_id: Joi.string().min(1).required(),
    card_holder: Joi.object({
      document: Joi.string().min(11).max(14).pattern(/[0-9]+/)
        .required(),
    }).required(),
    credit_card: Joi.object({
      holder_name: Joi.string().min(1).required(),
      number: Joi.string().min(1).required(),
      expiry_month: Joi.string().min(2).max(2).pattern(/[0-1][0-9]/)
        .required(),
      expiry_year: Joi.string().min(4).max(4).pattern(/[2][0][2-9][0-9]/)
        .required(),
      ccv: Joi.string().required(),
    }).required(),
  }).required(),
};
