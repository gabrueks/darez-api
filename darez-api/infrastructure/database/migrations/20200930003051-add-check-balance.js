module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'get_asaas_balance',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      get_asaas_balance: true,
    }, {
      name: ['admin', 'company_owner'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate('user_groups', {
      get_asaas_balance: false,
    }, {
      name: ['admin', 'company_owner'],
    });

    await queryInterface.removeColumn('user_groups', 'get_asaas_balance');
  },
};
