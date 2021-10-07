module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user_groups',
      'get_consultant',
      {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );

    await queryInterface.bulkUpdate('user_groups', {
      get_consultant: true,
    }, {
      name: ['admin'],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate('user_groups', {
      get_consultant: false,
    }, {
      name: ['admin'],
    });

    await queryInterface.removeColumn('user_groups', 'get_consultant');
  },
};
