module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'delete_client',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      delete_client: true,
    }, {
      name: ['company_owner'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_groups', 'delete_client');
  },
};
