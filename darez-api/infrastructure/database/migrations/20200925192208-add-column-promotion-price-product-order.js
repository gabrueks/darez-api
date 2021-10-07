module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'order_products',
      'promotion_price',
      {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('order_products', 'promotion_price');
  },
};
