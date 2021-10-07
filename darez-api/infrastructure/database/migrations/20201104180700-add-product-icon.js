module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'product_photos',
      'thumbnail',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('product_photos', 'thumbnail');
  },
};
