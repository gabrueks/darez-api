module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'document',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'document');
  },
};
