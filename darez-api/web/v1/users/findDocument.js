const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const { toSlack } = require('../slack');

const userRepository = new UserRepository(database);

module.exports = {
  findDocument: async ({ params }) => {
    try {
      const result = await userRepository.findOneByDocument(params.DOCUMENT);
      return httpResponse(200, result);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/findDocument');
      return httpResponse(500);
    }
  },
};
