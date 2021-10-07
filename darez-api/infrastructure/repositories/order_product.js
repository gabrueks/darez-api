module.exports = class OrderProductRepository {
  constructor(database) {
    this.database = database;
  }

  /**
   * Create the
   * @param {*} orderProducts Order's products
   * @param {*} transaction  Sequelize transaction
   */
  createMany(orderProducts, transaction) {
    return this.database.OrderProduct.bulkCreate(orderProducts, { transaction });
  }

  /**
   * Count the itens number from an Order
   *
   * @param {orderId} OrderId
   * @return the numbers of itens of an Order
   */
  async countProducts(orderId) {
    const result = await this.database.OrderProduct.findOne({
      attributes: [[this.database.Sequelize.fn('SUM', this.database.Sequelize.col('quantity')), 'count_products']],
      where: {
        order_id: orderId,
      },
      raw: true,
    });
    return result.count_products;
  }

  async findAllFromOrder(orderId) {
    const result = await this.database.OrderProduct.findAll({
      attributes: ['quantity', 'name', 'description', 'category', 'subcategory', 'product_id', 'product_variation_id', 'unity_price',
        'promotion_price'],
      where: {
        order_id: orderId,
      },
      include: {
        attributes: ['id'],
        model: this.database.Product,
        include: {
          attributes: ['photo_key'],
          model: this.database.ProductPhoto,
          limit: 1,
        },
      },
    });

    return result.map((i) => {
      const productPhoto = i.Product;
      return {
        quantity: i.quantity,
        name: i.name,
        description: i.description,
        category: i.category,
        subcategory: i.subcategory,
        product_id: i.product_id,
        product_variation_id: i.promotion_price,
        unity_price: i.product_variation_id,
        promotion_price: i.unity_price,
        photo_key: (productPhoto.ProductPhotos[0])
          ? productPhoto.ProductPhotos[0].photo_key
          : null,
      };
    });
  }
};
