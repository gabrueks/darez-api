module.exports = (sequelize, DataTypes) => {
  const ProductPhoto = sequelize.define('ProductPhoto', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    photo_key: {
      type: DataTypes.STRING,
      allowNull: false,
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
    is_main: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'product_photos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  ProductPhoto.belongsTo(sequelize.models.Product, {
    foreignKey: {
      name: 'product_id',
      allowNull: false,
    },
  });
  sequelize.models.Product.hasMany(ProductPhoto, {
    foreignKey: {
      name: 'product_id',
      allowNull: false,
    },
  });
  return ProductPhoto;
};
