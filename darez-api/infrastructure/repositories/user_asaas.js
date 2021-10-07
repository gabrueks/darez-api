module.exports = class UserAsaasRepository {
  constructor(database) {
    this.database = database;
  }

  findOne(userId, companyId, attributes = null, transaction) {
    return this.database.UserAsaas.findOne({
      attributes,
      where: {
        user_id: userId,
        company_id: companyId,
      },
      raw: true,
      transaction,
    });
  }

  create(user, transaction) {
    return this.database.UserAsaas.create({ ...user }, { transaction });
  }
};
