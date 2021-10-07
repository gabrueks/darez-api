const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserAddressRepository = require('../../../infrastructure/repositories/user_address');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const { toSlack } = require('../slack');

const userAddressRepository = new UserAddressRepository(database);

module.exports = {
  deleteAddresses: async ({ body, userId }) => {
    try {
      await userAddressRepository.logicalDelete(body.addresses, userId);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/deleteAddresses');
      return httpResponse(500);
    }
  },
};
