module.exports = (sequelize, DataTypes) => {
  const HomeSetupRegions = sequelize.define('HomeSetupRegions', {
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
    latitude: {
      allowNull: false,
      type: DataTypes.FLOAT(10, 6),
    },
    longitude: {
      allowNull: false,
      type: DataTypes.FLOAT(10, 6),
    },
    main_banner: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'home_setup_regions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  HomeSetupRegions.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  return HomeSetupRegions;
};
