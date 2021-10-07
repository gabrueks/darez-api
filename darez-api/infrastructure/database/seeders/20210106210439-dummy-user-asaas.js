module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user_asaas', [
      {
        id: 123984,
        user_id: 987654,
        company_id: 123987,
        asaas_id: 'asaasId',
        asaas_created_at: '2020-10-11 00:01:00',
        asaas_object: 'user',
        asaas_account_key: 'asaasAccountKey',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_asaas', null, {});
  },
};
