const Joi = require('joi');

module.exports = {
  UpdateProductSchema: Joi.object({
    name: Joi.string().min(1).max(255),
    description: Joi.string().min(1).max(8000).allow(null, ''),
    price: Joi.number(),
    category: Joi.string(),
    subcategory: Joi.string(),
    variations: Joi.array().items({
      id: Joi.number().min(1),
      color: Joi.string().min(1).allow(null),
      size: Joi.string().min(1).allow(null),
    }).allow(null),
    hidden: Joi.boolean(),
    main_image: Joi.number(),
  }).required(),
};
