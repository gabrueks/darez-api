const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const userRepository = new UserRepository(database);

module.exports = {
  findOne: async ({ params, userId }) => {
    try {
      const id = (!params.ID) ? userId : params.ID;
      const result = await userRepository.findOne(id);
      return httpResponse(200, result);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/findOne');
      return httpResponse(500);
    }
  },
};
