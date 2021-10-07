const { Op } = require('sequelize');
const { paginate } = require('./helper');

module.exports = class OrderRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create a new Order
   *
   * @param {*} order Order identification
   * @param {*} transaction Sequelize Transaction
   */
  create(order, transaction) {
    return this.database.Order.create(order, transaction);
  }

  /**
   * Update Order
   *
   * @param {*} id Identification
   * @param {*} field Field name
   * @param {*} transaction Sequelize transaction
   */
  update(id, field, transaction) {
    return this.database.Order.update(
      { ...field },
      {
        where: { id },
      },
      { transaction },
    );
  }

  /**
   * Finding all Order from an especifique Company
   *
   * @param {*} companyId Company identification code
   * @param {*} attributes Fields atttributes
   * @param {*} page Page to paginate
   * @param {*} pageSize Size of the paginated page
   */
  async findAllFromCompany(companyId, { page, pageSize }) {
    const result = await this.database.Order.findAll({
      attributes: ['id', 'company_id', 'buyer', 'cep', 'street', 'street_number',
        'address_2', 'neighborhood', 'city', 'state', 'price', 'payment_method',
        'change', 'status', 'created_at', 'updated_at'],
      where: {
        company_id: companyId,
      },
      include: {
        attributes: ['id', 'product_id', 'product_variation_id', 'quantity', 'unity_price',
          'name', 'description', 'category', 'subcategory', 'color', 'size'],
        model: this.database.OrderProduct,
        include: {
          attributes: ['id'],
          model: this.database.Product,
          include: {
            attributes: ['photo_key'],
            model: this.database.ProductPhoto,
            limit: 1,
          },
        },
      },
      order: [
        ['created_at', 'DESC'],
      ],
      ...paginate(page, pageSize),
    });
    return result.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      buyer: item.buyer,
      cep: item.cep,
      street: item.street,
      street_number: item.street_number,
      address_2: item.address_2,
      neighborhood: item.neighborhood,
      city: item.city,
      state: item.state,
      price: item.price,
      payment_method: item.payment_method,
      change: item.change,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      order_products: item.OrderProducts.map(({ dataValues }) => {
        const productPhoto = dataValues.Product;
        return {
          id: dataValues.id,
          product_id: dataValues.product_id,
          product_variation_id: dataValues.product_variation_id,
          quantity: dataValues.quantity,
          unity_price: dataValues.unity_price,
          name: dataValues.name,
          description: dataValues.description,
          category: dataValues.category,
          subcategory: dataValues.subcategory,
          color: dataValues.color,
          size: dataValues.size,
          photo_key: (productPhoto.ProductPhotos[0])
            ? productPhoto.ProductPhotos[0].photo_key
            : null,
        };
      }),
    }));
  }

  /**
   * Get the Order's information
   *
   * @param {*} orderId Order identification
   */
  findOne(orderId, attributes, transaction) {
    return this.database.Order.findOne({
      attributes,
      where: {
        id: orderId,
      },
      raw: true,
      transaction,
    });
  }

  /**
   * Finding all Order from an especifique User
   *
   * @param {object} query page and pageSize for pagination
   * @param {int} userId Identification
   * @param {list} attributes attributes requested
   */
  async findAllFromUser({ page, pageSize }, userId) {
    const result = await this.database.Order.findAll({
      attributes: ['id', 'company_id', 'buyer', 'cep', 'street', 'street_number',
        'address_2', 'neighborhood', 'city', 'state', 'price', 'payment_method',
        'change', 'status', 'created_at', 'updated_at'],
      where: {
        buyer: userId,
      },
      include: [
        {
          attributes: ['id', 'product_id', 'product_variation_id', 'quantity', 'unity_price',
            'name', 'description', 'category', 'subcategory', 'color', 'size', 'promotion_price'],
          model: this.database.OrderProduct,
          include: {
            attributes: ['id'],
            model: this.database.Product,
            include: {
              attributes: ['photo_key'],
              model: this.database.ProductPhoto,
              limit: 1,
            },
          },
        },
        {
          attributes: ['fantasy_name'],
          model: this.database.Company,
        },
      ],
      order: [
        ['created_at', 'DESC'],
      ],
      ...paginate(page, pageSize),
    });
    return result.map((item) => ({
      id: item.id,
      company_id: item.company_id,
      buyer: item.buyer,
      cep: item.cep,
      street: item.street,
      street_number: item.street_number,
      address_2: item.address_2,
      neighborhood: item.neighborhood,
      city: item.city,
      state: item.state,
      price: item.price,
      promotion_price: item.promotion_price,
      payment_method: item.payment_method,
      change: item.change,
      status: item.status,
      company: item.Company.fantasy_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      order_products: item.OrderProducts.map(({ dataValues }) => {
        const productPhoto = dataValues.Product;
        return {
          id: dataValues.id,
          product_id: dataValues.product_id,
          product_variation_id: dataValues.product_variation_id,
          quantity: dataValues.quantity,
          unity_price: dataValues.unity_price,
          name: dataValues.name,
          description: dataValues.description,
          category: dataValues.category,
          subcategory: dataValues.subcategory,
          color: dataValues.color,
          size: dataValues.size,
          photo_key: (productPhoto.ProductPhotos[0])
            ? productPhoto.ProductPhotos[0].photo_key
            : null,
        };
      }),
    }));
  }

  countTotal(companyId) {
    return this.database.Order.findOne({
      attributes: [[this.database.Sequelize.fn('COUNT', this.database.Sequelize.col('company_id')), 'total_orders']],
      where: { company_id: companyId },
      order: ['company_id'],
      raw: true,
    });
  }

  findAllDateRange({ initial, end }, id, isCompany = false) {
    const userCompany = {};
    if (isCompany) userCompany.company_id = id;
    else userCompany.buyer = id;
    return this.database.Order.findAll({
      attributes: ['id', 'company_id', 'price', 'payment_method', 'status', 'created_at'],
      where: {
        [Op.and]: {
          created_at: {
            [Op.and]: {
              [Op.gte]: initial,
              [Op.lte]: end,
            },
          },
          active: 1,
          ...userCompany,
        },
      },
      order: ['created_at'],
      raw: true,
    });
  }
};
