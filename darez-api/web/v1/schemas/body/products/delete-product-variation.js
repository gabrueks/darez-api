const Joi = require('joi');

module.exports = {
  DeleteProductVariationSchema: Joi.object({
    product_variation: Joi.array().min(1).items(Joi.number()).required(),
  }).required(),
};
