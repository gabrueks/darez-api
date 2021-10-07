module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'product_photos',
      'is_main',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('product_photos', 'is_main');
  },
};
