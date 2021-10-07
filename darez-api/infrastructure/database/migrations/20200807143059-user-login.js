module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'last_user_login',
      {
        type: Sequelize.DATE,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'users',
      'last_consultor_login',
      {
        type: Sequelize.DATE,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'users',
      'last_consultor_name_login',
      {
        allowNull: true,
        type: Sequelize.STRING,

      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'last_user_login');
    await queryInterface.removeColumn('users', 'last_consultor_login');
    await queryInterface.removeColumn('users', 'last_consultor_name_login');
  },
};
