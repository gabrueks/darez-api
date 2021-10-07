const { httpResponse } = require('../../../infrastructure/adapters/http');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const { createUserAddress } = require('../helpers');

module.exports = {
  createAddress: async ({ body, userId }) => {
    try {
      const result = await createUserAddress({ ...body }, userId);
      return httpResponse(201, result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('CREATE/SEND ERR => ', err);
      toSlack(SLACK_ERR, err, 'users/createAddresses');
      return httpResponse(500);
    }
  },
};
