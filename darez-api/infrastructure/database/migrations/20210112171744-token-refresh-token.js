module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'access_token',
      {
        allowNull: true,
<<<<<<< HEAD
        type: Sequelize.STRING,
=======
        type: Sequelize.STRING(1000),
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'users',
      'refresh_token',
      {
        allowNull: true,
<<<<<<< HEAD
        type: Sequelize.STRING,
=======
        type: Sequelize.STRING(1000),
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'access_token');
    await queryInterface.removeColumn('users', 'refresh_token');
  },
};
