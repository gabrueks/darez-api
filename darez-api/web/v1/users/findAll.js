const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserRepository = require('../../../infrastructure/repositories/user');
const { fieldVerification } = require('../helpers');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const userRepository = new UserRepository(database);

module.exports = {
  findAll: async ({ query }) => {
    try {
      const { page, pageSize } = (query.page && query.pageSize)
        ? query : { page: 0, pageSize: 2000 };
      const attributes = (query.field) ? fieldVerification(query.field) : null;
      const result = await userRepository.findAll(page, pageSize, attributes);
      return httpResponse(200, result);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'users/findAll');
      return httpResponse(500);
    }
  },
};
