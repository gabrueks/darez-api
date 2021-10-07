module.exports = class AsaasTransferDataRepository {
  constructor(database) {
    this.database = database;
  }

  create(transfer) {
    return this.database.AsaasTransferData.create(transfer);
  }
};
