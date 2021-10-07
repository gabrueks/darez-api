const { Op } = require('sequelize');

module.exports = class CompanyPaymentRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create a new payment method to a company
   *
   * @param {int} companyId Company identification
   * @param {string} method Payment method
   * @param {object} transaction Sequelize transaction
   */
  create(companyId, method, transaction) {
    return this.database.CompanyPayment.create({
      company_id: companyId,
      method,
    }, { transaction });
  }

  /**
   * Finding all Payment methods from an company
   *
   * @param {int} companyId Company identification
   */
  async findAllFromCompany(companyId) {
    const result = await this.database.CompanyPayment.findAll({
      attributes: ['method'],
      where: {
        [Op.and]: {
          company_id: companyId,
          active: 1,
        },
      },
      include: {
        model: this.database.PaymentMethod,
        attributes: ['online', 'has_change'],
      },
      raw: true,
    });
    return result.map((item) => ({
      name: item.method,
      online: item['PaymentMethod.online'],
      has_change: item['PaymentMethod.has_change'],
    }));
  }
};
