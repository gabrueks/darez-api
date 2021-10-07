const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const UserGroupRepository = require('../../../infrastructure/repositories/user_group');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const userGroupRepository = new UserGroupRepository(database);

module.exports = {
  findOne: async ({ params }) => {
    try {
      const response = await userGroupRepository.findOne(null, params.ID);
      return httpResponse(200, response);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'userGroups/findOne');
      return httpResponse(500);
    }
  },
};
