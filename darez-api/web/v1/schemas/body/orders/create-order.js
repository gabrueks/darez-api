const Joi = require('joi');

module.exports = {
  NewOrderSchema: Joi.object({
    company_id: Joi.number().required(),
    address: Joi.object({
      cep: Joi.string().min(8).max(8).pattern(/[0-9]+/)
        .required(),
      state: Joi.string().alphanum().case('upper').max(2)
        .required(),
      city: Joi.string().max(50).required(),
      street: Joi.string().max(200).required(),
      street_number: Joi.number().required(),
      address_2: Joi.string().max(20).allow(null).allow(''),
      neighborhood: Joi.string().max(200).required(),
    }),
    address_id: Joi.number(),
    payment_method: Joi.string().max(255).required(),
    total_price: Joi.number().precision(2).required(),
    products: Joi.array().min(1).items({
      product_id: Joi.number().min(1).required(),
      variation_id: Joi.number().min(1).allow(null),
      unity_price: Joi.number().precision(2).required(),
      promotion_price: Joi.number().precision(2),
      quantity: Joi.number().required(),
    }).required(),
    change: Joi.number().precision(2),
  }).required(),
};
