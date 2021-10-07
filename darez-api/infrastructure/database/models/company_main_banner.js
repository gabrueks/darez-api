module.exports = (sequelize, DataTypes) => {
  const HomeSetupCompanies = sequelize.define('HomeSetupCompanies', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    banner_url_high_res: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner_url_low_res: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'home_setup_companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  sequelize.models.Company.hasMany(HomeSetupCompanies, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  HomeSetupCompanies.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  return HomeSetupCompanies;
};
