const newSaleString = require('./newSaleString');
const newSaleSlackString = require('./newsaleSlackString');
const orderStatusString = require('./orderStatusString');
const slackChannel = require('./slackChannel');
const paymentMethods = require('./paymentMethods');
const algoliaMessages = require('./algoliaMessages');
const bankAccountTypeString = require('./bankAccountType');
const newCompanySlackString = require('./newCompanySlackString');
const welcomeCompanyString = require('./welcomeCompanyString');
const setupMainCompany = require('./setupMainCompany');
const error = require('./error');
const tokenExpTime = require('./tokenExpTime');
<<<<<<< HEAD
=======
const saleMethods = require('./saleMethods');
const dateSpliter = require('./dateSpliter');
const dateFormater = require('./dateFormater');
const timeFormater = require('./timeFormater');
const moneyFormater = require('./moneyFormater');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

module.exports = {
  newSaleString,
  newSaleSlackString,
  newCompanySlackString,
  welcomeCompanyString,
  orderStatusString,
  slackChannel,
  paymentMethods,
  saleMethods,
  algoliaMessages,
  bankAccountTypeString,
  setupMainCompany,
  dateSpliter,
  dateFormater,
  timeFormater,
  moneyFormater,
  ...error,
  ...tokenExpTime,
};
