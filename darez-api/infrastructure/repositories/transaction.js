module.exports = class TransactionRepository {
  constructor(database) {
    this.database = database;
  }

  initialize() {
    try {
      return this.database.sequelize.transaction();
    } catch (error) {
      return { error };
    }
  }

  transaction(f) {
    try {
      return this.database.sequelize.transaction(f);
    } catch (error) {
      return { error };
    }
  }

  /* eslint-disable class-methods-use-this */
  commit(transaction) {
    return transaction.commit();
  }

  rollback(transaction) {
    return transaction.rollback();
  }
};
