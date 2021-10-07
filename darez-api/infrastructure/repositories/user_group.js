module.exports = class UserGroupRepository {
  constructor(database) {
    this.database = database;
  }

  findOne(attributes = null, id) {
    return this.database.UserGroup.findOne({
      attributes,
      where: { id },
      raw: true,
    });
  }

  findOneName(attributes, name, transaction) {
    return this.database.UserGroup.findOne({
      attributes,
      where: { name },
      raw: true,
      transaction,
    });
  }
};
