const { Op } = require('sequelize');
const { calculateDistance } = require('./helper');

module.exports = class CategoryRepository {
  constructor(database) {
    this.database = database;
  }

  findAllRegion(attributes, query) {
    const distance = calculateDistance({ ...query });
    return this.database.Category.findAll({
      attributes,
      where: {
        active: true,
      },
      include: {
        model: this.database.Product,
        attributes: [],
        where: {
          active: true,
        },
        include: {
          model: this.database.Company,
          attributes: [],
          where: {
            [Op.and]: {
              delivery_range: {
                [Op.gt]: this.database.Sequelize.literal(distance),
              },
              active: true,
            },
          },
        },
      },
    });
  }

  findOne(name, attributes) {
    return this.database.Category.findOne({
      attributes,
      where: {
        name,
      },
      raw: true,
    });
  }

  findAll(attributes) {
    return this.database.Category.findAll({
      attributes,
      where: {
        active: true,
      },
    });
  }
};
