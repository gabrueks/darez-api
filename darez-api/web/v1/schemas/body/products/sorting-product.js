const Joi = require('joi');

module.exports = {
  SortingSchema: Joi.object({
    id: Joi.number().required(),
    old_sort_id: Joi.number().required(),
    new_sort_id: Joi.number().required(),
  }).required(),
};
