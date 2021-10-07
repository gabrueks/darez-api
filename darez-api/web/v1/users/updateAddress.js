const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserAddressRepository = require('../../../infrastructure/repositories/user_address');
const coordinates = require('../../../infrastructure/implementations/coordinates');

const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const userAddressRepository = new UserAddressRepository(database);
module.exports = {
  updateAddress: async ({ params, body, userId }) => {
    try {
      const id = (!params.ID) ? userId : params.ID;
      const { latitude, longitude } = await coordinates({ ...body });
      await userAddressRepository.update({ ...body, latitude, longitude }, id);
      return httpResponse(204);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('UPDATE/SEND ERR => ', err);
      toSlack(SLACK_ERR, err, 'users/updateAddress');
      return httpResponse(500);
    }
  },
};
