module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'companies',
      'category',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('companies', 'category');
  },
};
