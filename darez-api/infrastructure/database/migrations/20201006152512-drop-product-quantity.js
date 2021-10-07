module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('product_variations', 'quantity');
    await queryInterface.removeColumn('products', 'quantity');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'product_variations',
      'quantity',
      {
        allowNull: false,
        type: Sequelize.SMALLINT,
      },
    );

    await queryInterface.addColumn(
      'products',
      'quantity',
      {
        allowNull: false,
        type: Sequelize.SMALLINT,
      },
    );
  },
};
