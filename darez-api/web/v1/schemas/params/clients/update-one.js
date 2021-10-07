const Joi = require('joi');

module.exports = {
  updateOneClientParamsSchema: Joi.object({
    ID: Joi.number().min(1).required(),
  }).required(),
};
