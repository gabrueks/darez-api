module.exports = {
  up: async (queryInterface, Sequelize) => {
    const results = await queryInterface.getForeignKeyReferencesForTable('order_products');
    let fkNameOrder = '';
    results.forEach((item) => {
      if (item.columnName === 'order_id') {
        fkNameOrder = item.constraintName;
      }
    });
    await queryInterface.removeConstraint('order_products', fkNameOrder);
    await Sequelize.literal(`ALTER TABLE order_products DROP FOREIGN KEY ${fkNameOrder}`);

    await queryInterface.changeColumn(
      'orders',
      'id',
      {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
    );

    await queryInterface.changeColumn(
      'order_products',
      'order_id',
      {
        allowNull: false,
        type: Sequelize.UUID,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'change',
      {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'orders',
      'id',
      {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
    );

    await queryInterface.changeColumn(
      'order_products',
      'order_id',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    );

    await queryInterface.removeColumn('orders', 'change');
  },
};
