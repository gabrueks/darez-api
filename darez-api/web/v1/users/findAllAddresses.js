const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserAddressRepository = require('../../../infrastructure/repositories/user_address');
const { slackChannel: { SLACK_ERR } } = require('../helpers');
const { toSlack } = require('../slack');

const userAddressRepository = new UserAddressRepository(database);

module.exports = {
  findAllAddresses: async ({ userId = 1292 }) => {
    try {
      const result = await userAddressRepository.findAll(userId,
        ['id', 'user_id', 'cep', 'street', 'street_number', 'address_2',
          'neighborhood', 'city', 'state', 'latitude', 'longitude']);
      return httpResponse(200, result);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/findAllAddresses');
      return httpResponse(500);
    }
  },
};
