const Joi = require('joi');

module.exports = {
  SearchSchema: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    company_id: Joi.number(),
  }),
};
