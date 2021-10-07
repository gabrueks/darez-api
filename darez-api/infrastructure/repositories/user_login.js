module.exports = class UserLoginRepository {
  constructor(database) {
    this.database = database;
  }

  create(login, transaction) {
    return this.database.UserLogin.create(login, { transaction });
  }
};
