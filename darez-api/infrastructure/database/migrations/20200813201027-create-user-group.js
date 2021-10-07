module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      get_all_companies: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      update_companies: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      update_companies_banner: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      delete_companies_banner: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      update_companies_logo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      delete_companies_logo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      create_product: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      update_product: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      delete_product: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      update_product_image: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      delete_product_image: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
    await queryInterface.addColumn(
      'users',
      'user_group',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreign_key: true,
        references: {
          model: 'user_groups',
          key: 'id',
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'user_group');
    await queryInterface.dropTable('user_groups');
  },
};
