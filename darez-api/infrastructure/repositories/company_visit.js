const { Op, fn } = require('sequelize');
const { createVisitFilter } = require('./helper');

module.exports = class CompanyVisitRepository {
  constructor(database) {
    this.database = database;
  }

  create({ companyId, ipv4 }) {
    return this.database.CompanyVisit.create({
      company_id: companyId,
      userIpv4: ipv4,
    });
  }

  /**
   * Return the last visit of a user to a given company
   *
   * @param {Object} visit Informations about the visit
   * @param {string} visit.ipv4 The user ipv4
   * @param {number} visit.companyId The visited company id
   *
   * @return {Object} {created_at} - The timestamp when the last visit occured
   */
  findOne(visit) {
    return this.database.CompanyVisit.findOne({
      attributes: ['created_at'],
      where: {
        [Op.and]: {
          userIpv4: visit.ipv4,
          company_id: visit.companyId,
        },
      },
      raw: true,
    });
  }

  findAll(companies, before, after) {
    return this.database.CompanyVisit.findAll({
      group: ['company_id'],
      attributes: ['company_id', [fn('COUNT', 'company_id'), 'visits']],
      where: createVisitFilter(companies, before, after),
    });
  }
};
