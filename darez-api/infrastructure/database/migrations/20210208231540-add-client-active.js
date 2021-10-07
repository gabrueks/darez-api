module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'company_clients',
      'active',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('company_clients', 'active');
  },
};
