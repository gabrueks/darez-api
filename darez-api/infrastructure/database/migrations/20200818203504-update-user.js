module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'update_user',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_groups', 'update_user');
  },
};
