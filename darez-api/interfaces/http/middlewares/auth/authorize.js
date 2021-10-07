const Boom = require('@hapi/boom');
const { database } = require('../../../../infrastructure/adapters/database');
const UserRepository = require('../../../../infrastructure/repositories/user');
const UserGroupRepository = require('../../../../infrastructure/repositories/user_group');
const { unauthorized } = require('../../../../web/v1/helpers/strings/error');

const userRepository = new UserRepository(database);
const userGroupRepository = new UserGroupRepository(database);

module.exports = {
  authorize: (permission) => async (req, _res, next) => {
    try {
      const { user_group: group } = await userRepository.findUserGroup(req.userId);
      const allowed = await userGroupRepository.findOne([permission], group);
      if (!(parseInt(allowed[permission], 10))) throw new Error(unauthorized);
      return next();
    } catch (err) {
      if (err.message === unauthorized) throw Boom.unauthorized(unauthorized);
      throw Boom.internal();
    }
  },
};
