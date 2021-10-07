module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'companies',
      'banner',
      {
        type: Sequelize.STRING,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'companies',
      'logo',
      {
        type: Sequelize.STRING,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'companies',
      'created_by',
      {
        type: Sequelize.STRING,
        allowNull: true,

      },
    );
    await queryInterface.addColumn(
      'products',
      'created_by',
      {
        type: Sequelize.STRING,
        allowNull: true,

      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('companies', 'banner');
    await queryInterface.removeColumn('companies', 'logo');
    await queryInterface.removeColumn('companies', 'created_by');
    await queryInterface.removeColumn('products', 'created_by');
  },
};
