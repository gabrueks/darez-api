const Boom = require('@hapi/boom');

module.exports = class BusinesHoursRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create or Update  Schedules
   *
   * @param {schedule} schedule
   */
  async createOrUpdate(schedule, companyId, transaction) {
    try {
      const result = await this.database.BusinessHours.findOne({
        where: { company_id: companyId }, raw: true, transaction,
      });
      if (result) {
        await this.database.BusinessHours.update(schedule, {
          where: {
            company_id: companyId,
          },
          transaction,
        });
      } else {
        await this.database.BusinessHours.create(
          { ...schedule, company_id: companyId }, { transaction },
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      throw Boom.internal(error.message);
    }
  }

  /**
   * Get bussiness hours information about a company
   *
   * @param {integer} companyId Company's identification
   */
  findOne(companyId) {
    return this.database.BusinessHours.findOne({
      where: { company_id: companyId }, raw: true,
    });
  }
};
