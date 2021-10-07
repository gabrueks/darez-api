module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'get_all_user',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_group', 'get_all_user');
  },
};
