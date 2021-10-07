module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'access_token', 'web_access_token');
    await queryInterface.renameColumn('users', 'refresh_token', 'web_refresh_token');

    await queryInterface.addColumn(
      'users',
      'app_access_token',
      {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'users',
      'app_refresh_token',
      {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'web_access_token', 'access_token');
    await queryInterface.renameColumn('users', 'web_refresh_token', 'refresh_token');

    await queryInterface.removeColumn('users', 'app_access_token');
    await queryInterface.removeColumn('users', 'app_refresh_token');
  },
};
