module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('company_sales', [
      {
        id: 1111,
        company_id: 123987,
        price: 10.00,
        description: 'description',
        sale_method: 'Dinheiro',
        client_id: 1234,
        sale_time: '2010-10-10 10:10:00',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('company_sales', null, {});
  },
};
