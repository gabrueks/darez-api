module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'promotions',
      'deleted_at',
      {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('promotions', 'deleted_at');
  },
};
