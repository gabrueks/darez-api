module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define('Promotion', {
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
    discount: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
    },
    has_limit_date: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    date_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
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
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'promotions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  sequelize.models.Product.belongsTo(sequelize.models.Promotion, {
    foreignKey: {
      name: 'promotion',
      allowNull: false,
    },
  });
  sequelize.models.Promotion.hasMany(sequelize.models.Product, {
    foreignKey: {
      name: 'promotion',
      allowNull: false,
    },
  });
  sequelize.models.Promotion.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });
  sequelize.models.Company.hasMany(sequelize.models.Promotion, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  return Promotion;
};
