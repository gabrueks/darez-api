module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'products',
      'sort_id',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'sort_id');
  },
};
