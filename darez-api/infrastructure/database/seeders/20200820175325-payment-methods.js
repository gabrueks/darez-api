module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('payment_methods', [
      { method: 'Crédito', online: false, has_change: false },
      { method: 'Débito', online: false, has_change: false },
      { method: 'Dinheiro', online: false, has_change: true },
      { method: 'Cartão', online: true, has_change: false },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('payment_methods', null, {});
  },
};
