module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('company_clients', [
      {
        id: 1234,
        company_id: 123987,
        name: 'cliente',
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '123456789',
        email: 'client@client.com',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('company_clients', null, {});
  },
};
