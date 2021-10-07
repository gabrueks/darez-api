const Joi = require('joi');
const { bankAccountTypeString: { CORRENTE, POUPANCA } } = require('../../../helpers/strings');

module.exports = {
  NewTransferSchema: Joi.object({
    value: Joi.number().min(6).required(),
    bank_code: Joi.string().min(1).required(),
    owner_name: Joi.string().min(1).required(),
    document: Joi.string().min(11).max(14).pattern(/[0-9]+/)
      .required(),
    agency: Joi.string().min(1).required(),
    account: Joi.string().min(1).required(),
    account_digit: Joi.string().min(1).required(),
    account_type: Joi.string().pattern(new RegExp(`^${CORRENTE}$|^${POUPANCA}$`)).required(),
  }).required(),
};
