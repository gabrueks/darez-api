module.exports = {
  up: async (queryInterface, Sequelize) => {
    const results = await queryInterface.getForeignKeyReferencesForTable('company_sales');
    let fkName = '';
    results.forEach((item) => {
      if (item.columnName === 'payment_method') {
        fkName = item.constraintName;
      }
    });
    await queryInterface.removeConstraint('company_sales', fkName);

    await queryInterface.addColumn(
      'company_sales',
      'sale_method',
      {
        foreignKey: true,
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'sale_methods',
          key: 'method',
        },
      },
    );
    await queryInterface.removeColumn('company_sales', 'payment_method');
    await queryInterface.bulkInsert('sale_methods', [
      { method: 'Crédito', operator: 1 },
      { method: 'Débito', operator: 1 },
      { method: 'Dinheiro', operator: 1 },
      { method: 'Despesa', operator: -1 },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'company_sales',
      'payment_method',
      {
        foreignKey: true,
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: 'payment_methods',
          key: 'method',
        },
      },
    );
    const results = await queryInterface.getForeignKeyReferencesForTable('company_sales');
    let fkName = '';
    results.forEach((item) => {
      if (item.columnName === 'sale_method') {
        fkName = item.constraintName;
      }
    });
    await queryInterface.removeConstraint('company_sales', fkName);
    await queryInterface.removeColumn('company_sales', 'sale_method');
  },
};
