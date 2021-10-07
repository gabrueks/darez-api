module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_addresses',
      'latitude',
      {
        type: Sequelize.FLOAT(10, 6),
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'user_addresses',
      'longitude',
      {
        type: Sequelize.FLOAT(10, 6),
        allowNull: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_addresses', 'latitude');
    await queryInterface.removeColumn('user_addresses', 'longitude');
  },
};
