const { Op } = require('sequelize');
const { paginate, calculateDistance, calculatePageSize } = require('./helper');

module.exports = class CompanyRepository {
  constructor(database) {
    this.database = database;
  }

  findAll(page, pageSize, attributes) {
    return this.database.Company.findAll({
      attributes,
      order: [
        ['id', 'ASC'],
      ],
      where: {
        active: 1,
      },
      ...paginate(page, pageSize),
      raw: true,
    });
  }

  findAllCategory(category) {
    return this.database.Company.findAll({
      attributes: ['id', 'user_id', 'fantasy_name', 'cep', 'street', 'street_number', 'address_2',
        'neighborhood', 'city', 'state', 'banner', 'logo', 'endpoint', 'phone_country_code',
        'phone_area_code', 'phone_number',
        [this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('Products.id')), 'count_products']],
      where: {
        active: true,
      },
      include: {
        model: this.database.Product,
        attributes: [],
        where: {
          [Op.and]: {
            category,
            active: 1,
          },
        },
        group: ['company_id'],
      },
      having: {
        count_products: { [Op.gt]: 0 },
      },
      group: ['Company.id'],
      order: this.database.Sequelize.literal('count_products DESC'),
      raw: true,
    });
  }

  findAllCategoryRegion(category, query) {
    const distance = calculateDistance({ ...query });
    return this.database.Company.findAll({
      attributes: ['id', 'user_id', 'fantasy_name', 'cep', 'street', 'street_number', 'address_2',
        'neighborhood', 'city', 'state', 'banner', 'logo', 'endpoint', 'phone_country_code',
        'phone_area_code', 'phone_number',
        [this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('Products.id')), 'total_products']],
      where: {
        [Op.and]: {
          active: true,
          delivery_range: {
            [Op.gt]: this.database.Sequelize.literal(distance),
          },
        },
      },
      include: {
        model: this.database.Product,
        attributes: [],
        where: {
          [Op.and]: {
            category,
            active: 1,
          },
        },
        group: ['company_id'],
      },
      having: { total_products: { [Op.gt]: 0 } },
      group: ['Company.id'],
      order: this.database.Sequelize.literal('total_products DESC'),
      raw: true,
    });
  }

  /**
   * Get all region without localization filter
   *
   * @param {integer} page pages number
   * @param {iteger} pageSize pages size
   */
  async findAllRegionNoLoc(page, pageSize) {
    const result = await this.database.Company.findAll({
      attributes: ['id', 'user_id', 'street', 'street_number', 'cep', 'state', 'city', 'fantasy_name',
        'address_2', 'delivery_range', 'phone_number', 'phone_country_code', 'phone_area_code', 'latitude', 'longitude',
        'endpoint', 'logo', 'banner',
        [this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('Products.id')), 'total_products'],
      ],
      where: {
        active: true,
      },
      include: {
        model: this.database.Product,
        attributes: [],
        where: { active: 1 },
        group: ['company_id'],
      },
      group: ['Company.id'],
      having: {
        total_products: { [Op.gt]: 0 },
      },
      order: this.database.Sequelize.literal('total_products DESC'),
      raw: true,
    });
    return calculatePageSize(result, page, pageSize);
  }

  /**
   * Get all region with localization filter
   *
   * @param {intenter} page pages number
   * @param {integer} pageSize pages size
   * @param {object} localization object
   */
  async findAllRegion(page, pageSize, localization) {
    const distance = calculateDistance(localization);
    const result = await this.database.Company.findAll({
      attributes: ['id', 'user_id', 'street', 'street_number', 'cep', 'state', 'city', 'fantasy_name',
        'address_2', 'delivery_range', 'phone_number', 'phone_country_code', 'phone_area_code', 'latitude', 'longitude',
        [this.database.Sequelize.literal(distance), 'distance'], 'endpoint', 'logo', 'banner',
        [this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('Products.id')), 'total_products'],
      ],
      where: {
        [Op.and]: {
          delivery_range: {
            [Op.gt]: this.database.Sequelize.literal(distance),
          },
          active: true,
        },
      },
      include: {
        model: this.database.Product,
        attributes: [],
        where: { active: 1 },
        group: ['company_id'],
      },
      having: {
        total_products: { [Op.gt]: 0 },
      },
      group: ['Company.id'],
      order: this.database.Sequelize.literal('total_products DESC'),
      raw: true,
    });
    return calculatePageSize(result, page, pageSize);
  }

  async findAllRegionMap(page, pageSize, localization, range) {
    const distance = calculateDistance(localization);
    const result = await this.database.Company.findAll({
      attributes: ['id', 'user_id', 'street', 'street_number', 'cep', 'state', 'city', 'fantasy_name',
        'address_2', 'delivery_range', 'phone_number', 'phone_country_code', 'phone_area_code', 'latitude', 'longitude',
        [this.database.Sequelize.literal(distance), 'distance'],
        [this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('Products.id')), 'total_products'], 'endpoint', 'logo', 'banner',
      ],
      where: {
        active: true,
      },
      include: {
        model: this.database.Product,
        attributes: [],
        where: { active: 1 },
        group: ['company_id'],
      },
      having: {
        distance: { [Op.lte]: range },
        total_products: { [Op.gt]: 0 },
      },
      group: ['Company.id'],
      order: this.database.Sequelize.literal('total_products DESC'),
      raw: true,
    });
    return calculatePageSize(result, page, pageSize);
  }

  create(company, transaction) {
    return this.database.Company.create({ ...company }, { transaction });
  }

  findAllNeighborhoods() {
    const responseCity = this.database.Company.findAll({
      attributes: ['city', 'neighborhood'],
      order: [
        ['city', 'ASC'],
      ],
      where: {
        active: 1,
      },
      group: ['city', 'neighborhood'],
      raw: true,
    });
    return responseCity;
  }

  async update(id, field, transaction) {
    return this.database.Company.update(
      { ...field },
      { where: { id } },
      { transaction },
      { raw: true },
    );
  }

  async updateBannerOrLogo(id, updateBanner, banner = null, logo = null) {
    await this.database.Company.update(
      updateBanner ? { banner } : { logo },
      { where: { id }, raw: true },
    );
  }

  findOne(attributes, id, transaction) {
    return this.database.Company.findOne({
      attributes,
      where: { id },
      raw: true,
      transaction,
    });
  }

  findOneEndpoint(attributes, endpoint) {
    return this.database.Company.findOne({
      attributes,
      where: { endpoint },
      raw: true,
    });
  }

  findEndpoints() {
    return this.database.Company.findAll({
      attributes: ['endpoint'],
      raw: true,
    });
  }

  findUserLoginCode(id, transaction) {
    return this.database.Company.findOne({
      attributes: [],
      where: { id },
      include: {
        model: this.database.User,
        attributes: ['confirmation_code', 'full_name'],
      },
      transaction,
    });
  }

  findLastEndpoint(endpoint, transaction) {
    return this.database.Company.findOne({
      attributes: ['endpoint'],
      where: {
        endpoint: {
          [Op.like]: `${endpoint}%`,
        },
      },
      order: [
        ['created_at', 'DESC'],
      ],
      raw: true,
      transaction,
    });
  }

  findOneByUser(userId, transaction) {
    return this.database.Company.findOne({
      attributes: ['id'],
      where: { user_id: userId },
      raw: true,
      transaction,
    });
  }

  findCompanyFromUser(userId) {
    return this.database.Company.findOne({
      where: { user_id: userId },
      raw: true,
    });
  }

  /**
   * Get all companies to build Algolia's cache.
   */
  async findAllToSearch() {
    const result = await this.database.Company.findAll({
      attributes: ['id', 'user_id', 'document', 'fantasy_name', 'cep', 'street',
        'street_number', 'address_2', 'neighborhood', 'city', 'state', 'delivery_range',
        'latitude', 'longitude', 'banner', 'logo', 'created_by', 'endpoint',
        'phone_country_code', 'phone_area_code', 'phone_number', 'category', 'updated_by', 'active',
        'created_at', 'updated_at',
        [this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('Products.id')), 'total_products'],
      ],
      where: { active: true },
      include: {
        model: this.database.Product,
        attributes: [],
        where: { active: 1 },
        group: ['company_id'],
      },
      having: {
        total_products: { [Op.gt]: 0 },
      },
      group: ['Company.id'],
      order: this.database.Sequelize.literal('total_products DESC'),
      raw: true,
    });
    const companies = result.map((row) => ({
      objectID: row.id,
      ...row,
    }));
    return companies;
  }

  /**
   * Get main company from region.
   * @param {object} localization latitude and longitude
   * @param {range} range range to calculation of the area
   */
  async findMainCompany(localization) {
    const distance = calculateDistance(localization);
    const { range } = localization;
    const result = await this.database.Company.findOne({
      attributes: ['id', 'fantasy_name', 'endpoint', 'city', 'neighborhood', 'logo',
        [this.database.Sequelize.literal(distance), 'distance'],
      ],
      where: { active: true, is_main: 1 },
      include: {
        model: this.database.HomeSetupCompanies,
        attributes: ['banner_url_high_res', 'banner_url_low_res'],
      },
      having: {
        distance: { [Op.lte]: range || 10 },
      },
    });
    return (result
      ? {
        id: result.id,
        fantasy_name: result.fantasy_name,
        endpoint: result.endpoint,
        city: result.city,
        neighborhood: result.neighborhood,
        logo: result.logo,
        company_main_banners: result.HomeSetupCompanies,
      }
      : null);
  }
};
