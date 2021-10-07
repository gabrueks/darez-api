const Joi = require('joi');

module.exports = {
  LogicalDeleteProductSchema: Joi.object({
    products_ids_list: Joi.array().min(1).items(Joi.number()).required(),
  }).required(),
};
