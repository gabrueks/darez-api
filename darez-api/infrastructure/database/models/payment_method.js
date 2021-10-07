module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    method: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'payment_methods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  PaymentMethod.belongsToMany(sequelize.models.Company, {
    through: sequelize.models.CompanyPayment,
  });
  sequelize.models.Company.belongsToMany(PaymentMethod, {
    through: sequelize.models.CompanyPayment,
    foreignKey: {
      name: 'method',
      allowNull: false,
    },
  });

  sequelize.models.CompanyPayment.belongsTo(PaymentMethod, {
    foreignKey: {
      name: 'method',
      allowNull: false,
    },
  });
  PaymentMethod.hasMany(sequelize.models.CompanyPayment, {
    foreignKey: {
      name: 'method',
      allowNull: false,
    },
  });

  return PaymentMethod;
};
