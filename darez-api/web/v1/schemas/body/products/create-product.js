const Joi = require('joi');

module.exports = {
  NewProductSchema: Joi.object({
    companyId: Joi.number(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(8000).allow(null, ''),
    price: Joi.number().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    variations: Joi.array().items({
      color: Joi.string().min(1).allow(null),
      size: Joi.string().min(1).allow(null),
    }).allow(null),
  }).required(),
};
