const Joi = require('joi');

module.exports = {
  getOneClientSchema: Joi.object({
    ID: Joi.number().min(1).required(),
  }).required(),
};
