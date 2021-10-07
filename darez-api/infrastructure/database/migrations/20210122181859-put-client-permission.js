module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'put_client',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      put_client: true,
    }, {
      name: ['company_owner'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate('user_groups', {
      put_client: false,
    }, {
      name: ['company_owner'],
    });

    await queryInterface.removeColumn('user_groups', 'put_client');
  },
};
