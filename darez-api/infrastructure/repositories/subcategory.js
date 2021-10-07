const { Op } = require('sequelize');

module.exports = class SubcategoryRepository {
  constructor(database) {
    this.database = database;
  }

  findAllSubcategoryCategory(category) {
    return this.database.Subcategory.findAll({
      attributes: ['name'],
      where: {
        [Op.and]: {
          active: true,
          category,
        },
      },
      raw: true,
    });
  }
};
