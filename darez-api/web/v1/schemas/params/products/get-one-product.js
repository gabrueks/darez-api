const Joi = require('joi');

module.exports = {
  getOneProductSchema: Joi.object({
    ID: Joi.number().min(1).required(),
  }).required(),
};
