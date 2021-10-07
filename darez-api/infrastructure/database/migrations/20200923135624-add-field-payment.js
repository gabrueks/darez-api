module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'payment_methods',
      'online',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.addColumn(
      'payment_methods',
      'has_change',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('payment_methods', 'online');
    await queryInterface.removeColumn('payment_methods', 'has_change');
  },
};
