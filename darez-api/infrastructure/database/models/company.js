module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    document: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fantasy_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cep: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    street: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    street_number: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    address_2: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    neighborhood: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    delivery_range: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    latitude: {
      allowNull: true,
      type: DataTypes.FLOAT(10, 6),
    },
    longitude: {
      allowNull: true,
      type: DataTypes.FLOAT(10, 6),
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_country_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_area_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    asaas_account_key: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_login_email: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_wallet_id: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_object: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    category: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    ranking: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    facebook_url: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    instagram_url: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    employees: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  sequelize.models.BusinessHours.belongsTo(Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });
  return Company;
};
