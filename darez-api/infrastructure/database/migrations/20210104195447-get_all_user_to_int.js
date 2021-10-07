module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'user_groups',
      'get_all_user',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false,
      },
    );

    // await queryInterface.bulkUpdate('user_groups', {
    //   get_all_user: true,
    // }, {
    //   name: ['admin', 'company_owner'],
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkUpdate('user_groups', {
    //   get_all_user: false,
    // }, {
    //   name: ['admin', 'company_owner'],
    // });

    await queryInterface.changeColumn(
      'user_groups',
      'get_all_user',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
};
