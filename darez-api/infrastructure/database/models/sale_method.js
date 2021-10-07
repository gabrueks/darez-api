module.exports = (sequelize, DataTypes) => {
  const SaleMethod = sequelize.define('SaleMethod', {
    method: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    operator: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'sale_methods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  sequelize.models.CompanySales.hasOne(SaleMethod, {
    foreignKey: 'method',
    sourceKey: 'sale_method',
  });
  SaleMethod.belongsTo(sequelize.models.CompanySales, {
    foreignKey: 'method',
    targetKey: 'sale_method',
  });

  return SaleMethod;
};
