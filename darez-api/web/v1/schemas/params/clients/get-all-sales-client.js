const Joi = require('joi');

module.exports = {
  getClientSalesSchema: Joi.object({
    ID: Joi.number().min(1).required(),
  }).required(),
};
