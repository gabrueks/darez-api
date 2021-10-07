module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'created_by',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'users',
      'new_user',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'created_by');
    await queryInterface.removeColumn('users', 'new_user');
  },
};
