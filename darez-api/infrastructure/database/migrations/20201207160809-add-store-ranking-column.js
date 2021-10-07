module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'companies',
      'ranking',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('companies', 'ranking');
  },
};
