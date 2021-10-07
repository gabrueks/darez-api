// const Company = require('./company');
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    get_all_companies: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_companies: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_companies_banner: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_companies_banner: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_companies_logo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_companies_logo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    create_product: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_product: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_product: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_product_image: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_product_image: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_user: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_one_company: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_one_user: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_all_user: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_product_variation: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_company_orders: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_company_visits: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_consultant: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    swap_product: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_user_orders: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_one_order: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    create_promotion: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_promotion: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_promotion: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_asaas_balance: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    post_client: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_one_client: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    post_sale: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_all_client: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    put_client: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_sale: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_sales_range: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_sales_company: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_sale: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_all_sales_client: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    get_reports_kadernet: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_sale: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'user_groups',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  sequelize.models.User.belongsTo(UserGroup, {
    foreignKey: {
      name: 'user_group',
      allowNull: true,
    },
  });
  return UserGroup;
};
