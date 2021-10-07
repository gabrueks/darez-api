module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'products',
      'promotion_price',
      {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'promotion_price');
  },
};
