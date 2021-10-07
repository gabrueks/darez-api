module.exports = (sequelize, DataTypes) => {
  const CompanyPayment = sequelize.define('CompanyPayment', {
    company_id: {
      primaryKey: true,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    method: {
      primaryKey: true,
      foreignKey: true,
      type: DataTypes.STRING,
      references: {
        model: 'payment_methods',
        key: 'method',
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'company_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return CompanyPayment;
};
