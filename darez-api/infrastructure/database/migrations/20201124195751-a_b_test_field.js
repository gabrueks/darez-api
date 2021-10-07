module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'a_b_group',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'a_b_group');
  },
};
