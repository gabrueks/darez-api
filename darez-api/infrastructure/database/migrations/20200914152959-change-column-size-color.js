module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'order_products',
      'color',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.changeColumn(
      'order_products',
      'size',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'order_products',
      'color',
      {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
    );

    await queryInterface.changeColumn(
      'order_products',
      'size',
      {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '',
      },
    );
  },
};
