module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'company_sales',
      'active',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    );

    await queryInterface.addColumn(
      'company_sales',
      'deleted_at',
      {
        allowNull: true,
        type: Sequelize.DATE,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_groups', 'active');
    await queryInterface.removeColumn('user_groups', 'post_client');
  },
};
