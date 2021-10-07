module.exports = class UserAddressRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create an new user's address
   *
   * @param {object} address User's address
   * @param {*} id User's identification
   */
  create(address, userId, transaction) {
    return this.database.UserAddresses.create(
      { user_id: userId, ...address },
      { transaction }, { raw: true },
    );
  }

  /**
   * Update user's address
   *
   * @param {object} address User's object
   * @param {integer} userId Users's indentification
   */
  update(address, userId) {
    return this.database.UserAddresses.update(
      { ...address },
      {
        where:
          { id: address.id, user_id: userId },
      },
    );
  }

  /**
   * Get an address by ID
   *
   * @param {integer} addressId Address identification
   * @param {object} attributes Address attributes
   */
  findOne(addressId, attributes) {
    return this.database.UserAddresses.findOne(
      {
        attributes,
        where:
          { id: addressId },
        raw: true,
      },
    );
  }

  /**
   * Get all User's addresses
   * @param {integer} userId User's Identification
   */
  findAll(userId, attributes) {
    return this.database.UserAddresses.findAll({
      attributes,
      where:
      {
        user_id: userId, active: true,
      },
      raw: true,
    });
  }

  logicalDelete(addresses, userId) {
    return this.database.UserAddresses.update(
      { active: 0 },
      {
        where:
          { id: addresses, user_id: userId },
      },
    );
  }
};
