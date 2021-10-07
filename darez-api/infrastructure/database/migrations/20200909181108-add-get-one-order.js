module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'get_one_order',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_groups', 'get_one_order');
  },
};
