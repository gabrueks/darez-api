module.exports = (sequelize, DataTypes) => {
  const ProductVariation = sequelize.define('ProductVariation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'product_variations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  ProductVariation.belongsTo(sequelize.models.Product, {
    foreignKey: {
      name: 'product_id',
      allowNull: false,
    },
  });
  sequelize.models.Product.hasMany(ProductVariation, {
    foreignKey: {
      name: 'product_id',
      allowNull: false,
    },
  });

  return ProductVariation;
};
