module.exports = {
  up: async (queryInterface) => {
    const results = await queryInterface.getForeignKeyReferencesForTable('order_products');
    let fkName = '';
    results.forEach((item) => {
      if (item.columnName === 'product_variation_id') {
        fkName = item.constraintName;
      }
    });
    await queryInterface.removeConstraint('order_products', fkName);
  },

  down: async (queryInterface) => {
    await queryInterface.addConstraint('order_products', {
      fields: ['product_variation_id'],
      type: 'foreign key',
      references: {
        table: 'product_variations',
        field: 'id',
      },
    });
  },
};
