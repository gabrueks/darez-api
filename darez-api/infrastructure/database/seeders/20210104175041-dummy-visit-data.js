module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('company_visits', [
      {
        id: 1,
        company_id: 123987,
        userIpv4: '192.168.0.0',
        created_at: '2020-12-01 17:00:00',
      },
      {
        id: 2,
        company_id: 123987,
        userIpv4: '192.168.0.0',
        created_at: '2020-12-02 17:00:00',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('company_visits', null, {});
  },
};
