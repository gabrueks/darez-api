module.exports = (sequelize, DataTypes) => {
  const CompanyClients = sequelize.define('CompanyClients', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_country_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone_area_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING(1000),
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'company_clients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  CompanyClients.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });
  return CompanyClients;
};
