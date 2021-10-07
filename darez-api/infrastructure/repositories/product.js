const { Op } = require('sequelize');
const { calculateDistance, calculatePageSize } = require('./helper');

module.exports = class ProductRepository {
  constructor(database) {
    this.database = database;
  }

  create(product, transaction) {
    return this.database.Product.create({ ...product }, { transaction });
  }

  async findOne(attributes, id, date, transaction) {
    const result = await this.database.Product.findOne({
      attributes,
      where: { id },
      include: {
        attributes: ['id', 'has_limit_date', 'date_start', 'date_end', 'discount', 'created_by'],
        model: this.database.Promotion,
      },
      having: {
        [Op.or]: {
          [Op.and]: {
            'Promotion.date_start': { [Op.lte]: date },
            'Promotion.date_end': { [Op.gte]: date },
          },
          promotion: null,
        },
      },
      raw: true,
      group: 'Product.id',
      transaction,
    });
    Object.keys(result).forEach((key) => {
      if (key.substring(0, 9) === 'Promotion') {
        result[`promotion_${key.split('.')[1]}`] = result[key];
        delete result[key];
      }
    });
    return result;
  }

  findAllProductsFromPromotion(promotion, attributes, transaction) {
    return this.database.Product.findAll({
      attributes,
      where: {
        [Op.and]: {
          promotion,
          active: 1,
        },
      },
      raw: true,
      group: 'id',
      transaction,
      order: [['sort_id', 'ASC']],
    });
  }

  async findAllFromCompany(companyId, date, attributes) {
    const result = await this.database.Product.findAll({
      attributes,
      where: {
        [Op.and]: {
          company_id: companyId,
          active: 1,
        },
      },
      include: [
        {
          model: this.database.ProductPhoto,
          attributes: ['photo_key'],
        },
        {
          attributes: ['id', 'has_limit_date', 'date_start', 'date_end', 'discount', 'created_by'],
          model: this.database.Promotion,
        },
      ],
      having: {
        [Op.or]: {
          [Op.and]: {
            'Promotion.date_start': { [Op.lte]: date },
            'Promotion.date_end': { [Op.gte]: date },
          },
          promotion: null,
        },
      },
      raw: true,
      group: 'Product.id',
      order: [['sort_id', 'ASC']],
    });
    return result.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      name: item.name,
      description: item.description,
      price: item.price,
      promotion_price: item.promotion_price,
      category: item.category,
      subcategory: item.subcategory,
      sort_id: item.sort_id,
      photo_key: item['ProductPhotos.photo_key'],
      promotion_id: item['Promotion.id'],
      promotion_discount: item['Promotion.discount'],
      promotion_has_limit_date: item['Promotion.has_limit_date'],
      promotion_date_start: item['Promotion.date_start'],
      promotion_date_end: item['Promotion.date_end'],
      promotion_created_by: item['Promotion.created_by'],
    }));
  }

  async findAllProductsFromCategoryCompany(id, category, attributes, date) {
    const result = await this.database.Product.findAll({
      attributes,
      where: {
        [Op.and]: {
          category,
          active: 1,
        },
      },
      include: [
        {
          attributes: [],
          model: this.database.Company,
          where: {
            [Op.and]: {
              id,
              active: 1,
            },
          },
        },
        {
          model: this.database.ProductPhoto,
          attributes: ['photo_key', 'thumbnail'],
        },
        {
          attributes: ['id', 'has_limit_date', 'date_start', 'date_end', 'discount', 'created_by'],
          model: this.database.Promotion,
        },
      ],
      having: {
        [Op.or]: {
          [Op.and]: {
            'Promotion.date_start': { [Op.lte]: date },
            'Promotion.date_end': { [Op.gte]: date },
          },
          promotion: null,
        },
      },
      raw: true,
      group: 'Product.id',
      order: [['sort_id', 'ASC']],
    });
    return result.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      name: item.name,
      description: item.description,
      price: item.price,
      promotion_price: item.promotion_price,
      category: item.category,
      subcategory: item.subcategory,
      photo_key: (!item['ProductPhotos.thumbnail'])
        ? item['ProductPhotos.photo_key']
        : item['ProductPhotos.thumbnail'],
      sort_id: item.sort_id,
      promotion_id: item['Promotion.id'],
      promotion_discount: item['Promotion.discount'],
      promotion_has_limit_date: item['Promotion.has_limit_date'],
      promotion_date_start: item['Promotion.date_start'],
      promotion_date_end: item['Promotion.date_end'],
      promotion_created_by: item['Promotion.created_by'],
    }));
  }

  async findAllPreferences(category, date, localization, page, pageSize, attributes) {
    const distance = calculateDistance(localization);
    const result = await this.database.Product.findAll({
      attributes,
      where: {
        [Op.and]: {
          category,
          active: 1,
        },
      },
      include: [
        {
          model: this.database.ProductPhoto,
          attributes: ['photo_key'],
        },
        {
          attributes: ['id', 'has_limit_date', 'date_start', 'date_end', 'discount', 'created_by'],
          model: this.database.Promotion,
        },
        {
          model: this.database.Company,
          attributes: [
            [this.database.Sequelize.literal(distance), 'distance'],
            'endpoint',
          ],
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
      having: {
        [Op.or]: {
          [Op.and]: {
            'Promotion.date_start': { [Op.lte]: date },
            'Promotion.date_end': { [Op.gte]: date },
          },
          promotion: null,
        },
      },
    });
    if (!result.length) {
      return [];
    }
    const finalResult = calculatePageSize(result, page, pageSize);
    return finalResult.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      name: item.name,
      description: item.description,
      price: item.price,
      promotion_price: item.promotion_price,
      category: item.category,
      subcategory: item.subcategory,
      photo_key: item.ProductPhotos.map((photo) => photo.photo_key),
      promotion: item.Promotion,
      distance: item.Company.dataValues.distance,
      company_endpoint: item.Company.dataValues.endpoint,
    }));
  }

  update(id, field, transaction) {
    return this.database.Product.update(
      { ...field },
      {
        where: { id },
        transaction,
      },
    );
  }

  /**
   * Logical delete of a product
   * @param {int} id Product ID
   * @param {date} datetime Moment that the delete occured
   * @param {*} transaction Transaction object
   */
  logicalDelete(idList, datetime, transaction) {
    return this.database.Product.update(
      {
        active: 0,
        deleted_at: datetime,
      },
      {
        where: {
          id: {
            [Op.in]: idList,
          },
        },
      },
      { transaction },
    );
  }

  /**
   * Delete promotion from product
   * @param {int} promotion promotion ID
   */
  deletePromotion(promotion) {
    return this.database.Product.update(
      {
        promotion: null,
        promotion_price: null,
      },
      {
        where: {
          promotion,
        },
      },
    );
  }

  findProductsSubcategory(companyId) {
    return this.database.Product.findAll({
      attributes: [
        'subcategory',
        'category',
        [
          this.database.Sequelize.fn(
            'COUNT',
            this.database.Sequelize.col('Product.id'),
          ),
          'countProducts',
        ],
      ],
      where: {
        active: 1,
        company_id: companyId,
      },
      group: ['category', 'subcategory'],
      raw: true,
    });
  }

  async topCategory(companyId) {
    const result = await this.database.Product.findOne({
      attributes: ['category'],
      where: {
        active: 1,
        company_id: companyId,
      },
      group: ['category'],
      order: [
        [
          this.database.Sequelize.fn(
            'COUNT',
            this.database.Sequelize.col('Product.id'),
          ),
          'DESC',
        ],
      ],
      raw: true,
    });
    if (!result) {
      return 'Serviços';
    }
    return result.category;
  }

  /**
   * Get all products to build Algolia's cache.
   */
  async findAllToSearch() {
    const result = await this.database.Product.findAll({
      include: [
        {
          model: this.database.Company,
          attributes: ['fantasy_name', 'latitude', 'longitude', 'delivery_range'],
          require: true,
          where: {
            active: 1,
          },
        },
        {
          model: this.database.ProductPhoto,
          attributes: ['photo_key'],
          required: false,
          where: {
            active: true,
          },
        },
        {
          model: this.database.ProductVariation,
          attributes: ['color', 'size'],
          required: false,
          where: {
            active: true,
          },
        },
      ],
    });

    // here, as we have 3 relationship, if we try
    // to deliver without this parser we will get
    // the converting circular structure to json....but as pattern I leave
    // the english name properties...
    const products = result.map((row) => ({
      objectID: row.id,
      company_id: row.company_id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      subcategory: row.subcategory,
      photos: row.ProductPhotos.map((product) => product.photo_key),
      fantasy_name: row.Company.fantasy_name,
      delivery_range: row.Company.delivery_range,
      latitude: row.Company.latitude,
      longitude: row.Company.longitude,
    }));
    return products;
  }

  /**
   * Update items thas has been moved.
   *
   * @param {array} products Array with ids that will be moved/updated
   * @param {*} sumSub operation type
   * @param {object} transaction transaction
   */
  updateSumSubSort(products, sumSub, transaction) {
    // eslint-disable-next-line quotes
    const operation = sumSub === 1 ? `sort_id - 1` : `sort_id + 1`;
    return this.database.Product.update(
      { sort_id: this.database.Sequelize.literal(operation) },
      {
        where: { id: products },
        transaction,
      },
    );
  }

  /**
   * Get all ids that will be changed no matters how the direction for.
   *
   * @param {integer} companyId Company's identification
   * @param {integer} oldSortId id that will be changed to
   * @param {integer} new_sort_id id that will be changed from
   * @param {integer} operation 1-Top->Bottom : 2-Bottom->Top
   */
  findProductToSort(companyId, oldSortId, newSortId, operation, transaction) {
    const sortId = operation === 1
      ? {
        [Op.gt]: oldSortId,
        [Op.lte]: newSortId,
      }
      : {
        [Op.lt]: oldSortId,
        [Op.gte]: newSortId,
      };
    return this.database.Product.findAll({
      attributes: ['id'],
      where: {
        company_id: companyId,
        active: 1,
        sort_id: sortId,
      },
      raw: true,
      transaction,
    });
  }

  /**
   * Get the last sort_id from the product
   *
   * @param {integer} companyId Company's identification
   * @param {object} transaction  Transaction object
   */
  findLastSort(companyId, transaction) {
    return this.database.Product.max('sort_id', {
      where: {
        company_id: companyId,
      },
      transaction,
    });
  }
};
