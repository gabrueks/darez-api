module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'company_sales',
      'split_times',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    );

    await queryInterface.addColumn(
      'company_sales',
      'split_number',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('company_sales', 'split_times');
    await queryInterface.removeColumn('company_sales', 'split_number');
  },
};
