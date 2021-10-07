const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const userRepository = new UserRepository(database);

module.exports = {
  update: async ({ params, body, userId }) => {
    try {
      const id = (!params.ID) ? userId : params.ID;
      await userRepository.update({ ...body }, id);
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/update');
      return httpResponse(500);
    }
  },
};
