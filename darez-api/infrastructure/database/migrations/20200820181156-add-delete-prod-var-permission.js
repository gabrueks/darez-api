module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'delete_product_variation',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.changeColumn(
      'user_groups',
      'get_one_company',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.changeColumn(
      'user_groups',
      'get_one_user',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_group', 'delete_product_variation');

    await queryInterface.changeColumn(
      'user_groups',
      'get_one_company',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.changeColumn(
      'user_groups',
      'get_one_user',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
};
