module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define('Subcategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      foreign_key: true,
      references: {
        model: 'categories',
        key: 'name',
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'subcategories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  sequelize.models.Product.hasOne(Subcategory, {
    foreignKey: {
      name: 'subcategory',
      allowNull: false,
    },
  });
  Subcategory.belongsTo(sequelize.models.Category, {
    foreignKey: {
      name: 'category',
      allowNull: false,
    },
  });
  return Subcategory;
};
