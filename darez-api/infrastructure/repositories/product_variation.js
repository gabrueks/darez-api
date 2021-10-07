const { Op } = require('sequelize');

module.exports = class ProductVariationRepository {
  constructor(database) {
    this.database = database;
  }

  create(variation, transaction) {
    return this.database.ProductVariation.create({
      product_id: variation.productId,
      color: variation.color,
      size: variation.size,
    }, { transaction });
  }

  findOne(attributes, id, transaction) {
    return this.database.ProductVariation.findOne({
      attributes,
      where: {
        [Op.and]: {
          id,
          active: 1,
        },
      },
      transaction,
    });
  }

  findProductVariations(attributes, productId) {
    return this.database.ProductVariation.findAll({
      attributes,
      where: {
        [Op.and]: {
          product_id: productId,
          active: 1,
        },
      },
      raw: true,
    });
  }

  update(ID, variation, transaction) {
    return this.database.ProductVariation.update(
      {
        color: variation.color,
        size: variation.size,
        product_id: ID,
      },
      {
        where: { id: variation.id },
      },
      { transaction },
    );
  }

  /**
   * Logical delete the all the variations of a product
   * @param {int} productId Product ID
   * @param {date} datetime Moment that the delete occured
   * @param {*} transaction Transaction object
   */
  logicalDelete(productIdList, datetime, transaction) {
    return this.database.ProductVariation.update(
      {
        active: 0,
        deleted_at: datetime,
      },
      {
        where: {
          product_id: {
            [Op.in]: productIdList,
          },
        },
      },
      { transaction },
    );
  }

  deleteMany(id, productId, datetime, transaction) {
    return this.database.ProductVariation.update(
      {
        active: 0,
        deleted_at: datetime,
      },
      {
        where: {
          [Op.and]: {
            id,
            product_id: productId,
          },
        },
      },
      { transaction },
    );
  }
};
