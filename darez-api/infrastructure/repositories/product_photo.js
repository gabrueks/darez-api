const { Op } = require('sequelize');

module.exports = class ProductPhotoRepository {
  constructor(database) {
    this.database = database;
  }

  create(photo) {
    return this.database.ProductPhoto.create(photo);
  }

  update(id, fields, transaction) {
    return this.database.ProductPhoto.update(
      { ...fields },
      {
        where: { id },
        transaction,
      },
    );
  }

  findMainOfProduct(attributes, productId, transaction) {
    return this.database.ProductPhoto.findOne({
      attributes,
      where: {
        [Op.and]: {
          is_main: true,
          product_id: productId,
        },
      },
      raw: true,
      transaction,
    });
  }

  async findAllMainFromCompany(companyId) {
    const result = await this.database.Product.findAll({
      attributes: [],
      where: {
        [Op.and]: {
          company_id: companyId,
          active: 1,
        },
      },
      include: [
        {
          model: this.database.ProductPhoto,
          attributes: ['product_id', 'photo_key', 'thumbnail'],
          where: { is_main: true },
        },
      ],
      raw: true,
      group: 'Product.id',
      order: [
        ['sort_id', 'ASC'],
      ],
    });
    const data = {};
    result.forEach((item) => {
      data[item['ProductPhotos.product_id']] = (!item['ProductPhotos.thumbnail'])
        ? item['ProductPhotos.photo_key']
        : item['ProductPhotos.thumbnail'];
    });
    return data;
  }

  findPhotos(productId, attributes) {
    return this.database.ProductPhoto.findAll({
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

  findAllById(attributes, id, productId) {
    return this.database.ProductPhoto.findAll({
      attributes,
      where: {
        [Op.and]: {
          id,
          product_id: productId,
        },
      },
      raw: true,
    });
  }

  deleteMany(id, productId) {
    return this.database.ProductPhoto.destroy({
      where: {
        [Op.and]: {
          id,
          product_id: productId,
        },
      },
    });
  }

  /**
   *
   * @param {int} productId Product ID
   * @param {date} datetime Moment that the delete occured
   * @param {*} transaction Transaction object
   */
  logicalDelete(productIdList, datetime, transaction) {
    return this.database.ProductPhoto.update(
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
};
