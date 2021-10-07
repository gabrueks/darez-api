module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user_addresses', [
      {
        id: 7895,
        user_id: 987653,
        cep: '02462050',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Chora Menino',
        street: 'R. Jauari',
        street_number: 57,
        address_2: '',
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_addresses', null, {});
  },
};
