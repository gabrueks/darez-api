// const products = require("../../../web/v1/schemas/products");

module.exports = (sequelize, DataTypes) => {
  const OrderProduct = sequelize.define('OrderProduct', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    order_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.UUID,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    product_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    product_variation_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      references: {
        model: 'product_variations',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    unity_price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    promotion_price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    company_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    size: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'order_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  sequelize.models.OrderProduct.belongsTo(sequelize.models.Order, {
    foreignKey: {
      name: 'order_id',
      allowNull: false,
    },
  });

  sequelize.models.Order.hasMany(sequelize.models.OrderProduct, {
    foreignKey: {
      name: 'order_id',
      allowNull: false,
    },
  });
  return OrderProduct;
};
