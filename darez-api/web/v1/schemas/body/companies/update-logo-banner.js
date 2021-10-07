const Joi = require('joi');

module.exports = {
  UpdateLogoBannerSchema: Joi.object({
    file: Joi.string().required(),
    type: Joi.string().required(),
  }).required(),
};
