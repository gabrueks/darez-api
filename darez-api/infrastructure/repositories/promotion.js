const { Op } = require('sequelize');
const { calculateDistance, calculatePageSize } = require('./helper');

module.exports = class PromotionRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * find all promotion from company
   * @param {object} promotion Moment that the search occured
   * @param {*} transaction to return
   */
  create(promotion, transaction) {
    return this.database.Promotion.create({ ...promotion }, { transaction }, { raw: true });
  }

  /**
   * find all promotion from company
   * @param {int} id Promotion ID
   * @param {string} date Moment that the search occured
   * @param {vector} attributes atributes to return
   */
  async findOne(id, date, attributes) {
    const result = await this.database.Promotion.findOne({
      attributes,
      where: {
        [Op.and]: {
          id,
          date_start: { [Op.lte]: date },
          date_end: { [Op.gte]: date },
          active: 1,
        },
      },
      include: {
        model: this.database.Product,
        include: {
          model: this.database.ProductPhoto,
          attributes: ['photo_key'],
        },
      },
    });
    if (result) {
      const products = result.dataValues.Products.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        description: item.description,
        price: item.price,
        promotion_price: item.promotion_price,
        category: item.category,
        subcategory: item.subcategory,
        created_by: item.created_by,
        photo_key: item.ProductPhotos.map((photo) => photo.photo_key),
      }));
      delete result.dataValues.Products;
      return { ...result.dataValues, products };
    }
    return null;
  }

  /**
   * find all promotion from company
   * @param {int} companyId company ID
   * @param {string} date Moment that the search occured
   * @param {vector} attributes atributes to return
   */
  async findAllFromCompany(companyId, date, attributes) {
    const result = await this.database.Promotion.findAll({
      attributes,
      where: {
        [Op.and]: {
          company_id: companyId,
          active: 1,
          date_start: { [Op.lte]: date },
          date_end: { [Op.gte]: date },
        },
      },
      include: {
        model: this.database.Product,
        include: {
          model: this.database.ProductPhoto,
          attributes: ['photo_key'],
        },
      },
    });
    return result.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      discount: item.discount,
      has_limit_date: item.has_limit_date,
      date_start: item.date_start,
      date_end: item.date_end,
      created_by: item.created_by,
      products: item.Products.map((prod) => ({
        id: prod.id,
        name: prod.name,
        quantity: prod.quantity,
        description: prod.description,
        price: prod.price,
        promotion_price: prod.promotion_price,
        category: prod.category,
        subcategory: prod.subcategory,
        created_by: prod.created_by,
        photo_key: prod.ProductPhotos.map((photo) => photo.photo_key),
      })),
    }));
  }

  /**
   * Update of a promotion
   * @param {int} id Promotion ID
   * @param {object} field fields to update
   * @param {*} transaction Transaction object
   */
  update(id, field, transaction) {
    return this.database.Promotion.update(
      { ...field },
      {
        where: { id },
        transaction,
      },
    );
  }

  /**
   * Logical delete of a promotion
   * @param {int} id Promotion ID
   * @param {string} datetime Moment that the delete occured
   * @param {*} transaction Transaction object
   */
  logicalDelete(id, datetime, transaction) {
    return this.database.Promotion.update(
      {
        active: 0,
        deleted_at: datetime,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );
  }

  /**
   * Schdule delete of a promotion
   * @param {string} datetime Moment that the delete occured
   */
  async scheduleDelete(datetime) {
    const ids = await this.database.Promotion.findAll({
      attributes: ['id'],
      where: {
        [Op.and]: {
          date_end: {
            [Op.lt]: datetime,
          },
          active: 1,
        },
      },
      raw: true,
    });
    await this.database.Promotion.update(
      {
        active: 0,
        deleted_at: datetime,
      },
      {
        where: {
          date_end: {
            [Op.lt]: datetime,
          },
        },
      },
    );

    return ids;
  }

  /**
   * Get all promotion in region with localization filter
   *
   * @param {integer} page pages number
   * @param {integer} pageSize pages size
   * @param {string} date moment when search occured
   * @param {object} localization object
   */
  async findAllRegion(page, pageSize, date, localization) {
    const distance = calculateDistance(localization);
    const result = await this.database.Promotion.findAll({
      attributes: ['id', 'company_id', 'discount', 'has_limit_date', 'date_start', 'date_end', 'created_by',
      ],
      where: {
        [Op.and]: {
          active: 1,
          date_start: { [Op.lte]: date },
          date_end: { [Op.gte]: date },
        },
      },
      include: [
        {
          model: this.database.Product,
          where: { active: 1 },
          include: {
            model: this.database.ProductPhoto,
            attributes: ['photo_key'],
          },
        },
        {
          model: this.database.Company,
          attributes: [[this.database.Sequelize.literal(distance), 'distance'], 'endpoint'],
          where: {
            [Op.and]: {
              delivery_range: {
                [Op.gt]: this.database.Sequelize.literal(distance),
              },
              active: true,
            },
          },
        },
      ],
      order: this.database.Sequelize.literal('discount DESC'),
    });
    if (!result.length) {
      return [];
    }
    const paginated = calculatePageSize(result, page, pageSize);
    return paginated.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      discount: item.discount,
      has_limit_date: item.has_limit_date,
      date_start: item.date_start,
      date_end: item.date_end,
      created_by: item.created_by,
      distance: item.Company.dataValues.distance,
      company_endpoint: item.Company.dataValues.endpoint,
      products: item.Products.map((prod) => ({
        id: prod.id,
        name: prod.name,
        quantity: prod.quantity,
        description: prod.description,
        price: prod.price,
        promotion_price: prod.promotion_price,
        category: prod.category,
        subcategory: prod.subcategory,
        created_by: prod.created_by,
        photo_key: prod.ProductPhotos.map((photo) => photo.photo_key),
      })),
    }));
  }

  /**
   * Get all promotion
   *
   * @param {integer} page pages number
   * @param {integer} pageSize pages size
   * @param {string} date moment when search occured
   */
  async findAll(page, pageSize, date) {
    const result = await this.database.Promotion.findAll({
      attributes: ['id', 'company_id', 'discount', 'has_limit_date', 'date_start', 'date_end', 'created_by',
      ],
      where: {
        [Op.and]: {
          active: 1,
          date_start: { [Op.lte]: date },
          date_end: { [Op.gte]: date },
        },
      },
      include: [
        {
          model: this.database.Product,
          where: { active: 1 },
          include: {
            model: this.database.ProductPhoto,
            attributes: ['photo_key'],
          },
        },
        {
          model: this.database.Company,
          attributes: ['endpoint'],
          where: {
            active: true,
          },
        },
      ],
      order: this.database.Sequelize.literal('discount DESC'),
    });
    if (!result.length) {
      return [];
    }
    const paginated = calculatePageSize(result, page, pageSize);
    return paginated.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      discount: item.discount,
      has_limit_date: item.has_limit_date,
      date_start: item.date_start,
      date_end: item.date_end,
      created_by: item.created_by,
      endpoint: item.Company.dataValues.endpoint,
      products: item.Products.map((prod) => ({
        id: prod.id,
        name: prod.name,
        quantity: prod.quantity,
        description: prod.description,
        price: prod.price,
        promotion_price: prod.promotion_price,
        category: prod.category,
        subcategory: prod.subcategory,
        created_by: prod.created_by,
        photo_key: prod.ProductPhotos.map((photo) => photo.photo_key),
      })),
    }));
  }
};
