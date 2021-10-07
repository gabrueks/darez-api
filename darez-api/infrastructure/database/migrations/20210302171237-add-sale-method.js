module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('sale_methods', [
      { method: 'Compra de Mercadoria', operator: -1 },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('sale_methods', { method: 'Compra de Mercadoria' }, {});
  },
};
