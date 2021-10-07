module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'swap_product',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      swap_product: true,
    }, {
      name: ['admin', 'company_owner'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate('user_groups', {
      swap_product: false,
    }, {
      name: ['admin', 'company_owner'],
    });

    await queryInterface.removeColumn('user_groups', 'swap_product');
  },
};
