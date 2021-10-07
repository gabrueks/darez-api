module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'companies',
      'facebook_url',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'instagram_url',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('companies', 'facebook_url');
    await queryInterface.removeColumn('companies', 'instagram_url');
  },
};
