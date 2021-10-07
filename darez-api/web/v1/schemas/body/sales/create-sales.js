const Joi = require('joi');

module.exports = {
  NewSaleSchema: Joi.object({
    client_id: Joi.number().min(1),
    price: Joi.number().min(1).required(),
    sale_method: Joi.string(),
    description: Joi.string(),
    date: Joi.string().max(10).pattern(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/)
      .required(),
    time: Joi.string().min(5).max(5).pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
      .required(),
    split_times: Joi.number().min(1),
  }).required(),
};
