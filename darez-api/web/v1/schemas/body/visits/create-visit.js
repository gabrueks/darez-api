const Joi = require('joi');

module.exports = {
  NewVisitSchema: Joi.object({
    companyId: Joi.number().required(),
  }).required(),
};
