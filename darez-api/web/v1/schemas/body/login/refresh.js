const Joi = require('joi');

module.exports = {
  refreshSchema: Joi.object({
    access_token: Joi.string().required(),
    refresh_token: Joi.string().required(),
<<<<<<< HEAD
=======
    host: Joi.string(),
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
  }).required(),
};
