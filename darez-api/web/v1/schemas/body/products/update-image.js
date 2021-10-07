const Joi = require('joi');

module.exports = {
  UpdateImageSchema: Joi.object({
    files: Joi.array().items(
      Joi.object({
        file: Joi.string().required(),
        type: Joi.string().required(),
      }).required(),
    ).required(),
  }).required(),
};
