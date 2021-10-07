module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    promotion_price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      foreign_key: true,
      references: {
        model: 'categories',
        key: 'name',
      },
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
      foreign_key: true,
      references: {
        model: 'subcategories',
        key: 'name',
      },
    },
    hidden: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    promotion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      foreign_key: true,
      references: {
        model: 'promotions',
        key: 'id',
      },
    },
    sort_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Product.hasOne(sequelize.models.Category, {
    foreignKey: {
      name: 'category',
      allowNull: false,
    },
  });
  sequelize.models.Category.hasMany(Product, {
    foreignKey: {
      name: 'category',
      allowNull: false,
    },
  });
  Product.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });
  sequelize.models.Company.hasMany(Product, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  sequelize.models.OrderProduct.belongsTo(Product, {
    foreignKey: {
      name: 'product_id',
      allowNull: false,
    },
  });
  Product.hasMany(sequelize.models.OrderProduct, {
    foreignKey: {
      name: 'product_id',
      allowNull: false,
    },
  });

  return Product;
};
