const login = require('./login');
const verify = require('./verify');
const refresh = require('./refresh');
<<<<<<< HEAD
=======
const authLogin = require('./authLogin');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

module.exports = {
  ...login,
  ...verify,
  ...refresh,
<<<<<<< HEAD
=======
  ...authLogin,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
};
