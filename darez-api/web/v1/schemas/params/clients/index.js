const { getOneClientSchema } = require('./get-one');
const { updateOneClientParamsSchema } = require('./update-one');
const { getClientSalesSchema } = require('./get-all-sales-client');

module.exports = {
  getOneClientSchema,
  updateOneClientParamsSchema,
  getClientSalesSchema,
};
