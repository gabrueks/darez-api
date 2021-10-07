module.exports = (sequelize, DataTypes) => {
  const CompanySales = sequelize.define('CompanySales', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      foreignKey: true,
      references: {
        model: 'company_clients',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    sale_method: {
      foreignKey: true,
      type: DataTypes.STRING,
      references: {
        model: 'sale_methods',
        key: 'method',
      },
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING(1000),
      defaultValue: null,
    },
    split_times: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    split_number: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    sale_time: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'company_sales',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  CompanySales.belongsTo(sequelize.models.CompanyClients, {
    foreignKey: {
      name: 'client_id',
      allowNull: false,
    },
  });
  CompanySales.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  return CompanySales;
};
