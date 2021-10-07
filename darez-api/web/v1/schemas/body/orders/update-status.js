const Joi = require('joi');
const { orderStatusString: { CONFIRMED, DELIVERED, CANCELLED } } = require('../../../helpers/strings');

module.exports = {
  UpdateOrderStatusSchema: Joi.object({
    status: Joi.string().pattern(new RegExp(`^${CONFIRMED}$|^${DELIVERED}$|^${CANCELLED}$`)).required(),
  }).required(),
};
