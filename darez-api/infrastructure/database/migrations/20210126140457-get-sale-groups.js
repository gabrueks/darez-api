module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'get_sales_range',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.addColumn(
      'user_groups',
      'get_sales_company',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      get_sales_range: true,
      get_sales_company: true,
    }, {
      name: ['company_owner'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate('user_groups', {
      get_sales_range: false,
      get_sales_company: false,
    }, {
      name: ['company_owner'],
    });

    await queryInterface.removeColumn('user_groups', 'get_sales_range');
    await queryInterface.removeColumn('user_groups', 'get_sales_company');
  },
};
