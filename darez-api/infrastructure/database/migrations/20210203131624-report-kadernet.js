module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'get_reports_kadernet',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      get_reports_kadernet: true,
    }, {
      name: ['company_owner'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_groups', 'get_reports_kadernet');
  },
};
