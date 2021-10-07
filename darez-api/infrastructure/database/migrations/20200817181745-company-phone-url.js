module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'companies',
      'endpoint',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'phone_country_code',
      {
        allowNull: false,
        type: Sequelize.STRING,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'phone_area_code',
      {
        allowNull: false,
        type: Sequelize.STRING,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'phone_number',
      {
        allowNull: false,
        type: Sequelize.STRING,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'updated_by',
      {
        type: Sequelize.STRING,
        allowNull: true,

      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('companies', 'endpoint');
    await queryInterface.removeColumn('companies', 'phone_country_code');
    await queryInterface.removeColumn('companies', 'phone_area_code');
    await queryInterface.removeColumn('companies', 'phone_number');
    await queryInterface.removeColumn('companies', 'updated_by');
  },
};
