module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'products',
      'deleted_at',
      {
        type: Sequelize.DATE,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'product_variations',
      'deleted_at',
      {
        type: Sequelize.DATE,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'product_photos',
      'deleted_at',
      {
        type: Sequelize.DATE,
        allowNull: true,

      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'deleted_at');
    await queryInterface.removeColumn('product_variations', 'deleted_at');
    await queryInterface.removeColumn('product_photos', 'deleted_at');
  },
};
