module.exports = class SaleMethodRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Finding all Sale methods
   *
   */
  async findAll() {
    const result = await this.database.SaleMethod.findAll({
      attributes: ['method', 'operator'],
      where: {
        active: 1,
      },
      raw: true,
    });
    return result.map((item) => ({
      name: item.method,
      operator: item.operator,
    }));
  }
};
