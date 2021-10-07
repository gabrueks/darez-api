const Joi = require('joi');

module.exports = {
  DeleteProductImageSchema: Joi.object({
    image_id: Joi.array().min(1).items(Joi.number()).required(),
  }).required(),
};
