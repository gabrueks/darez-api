module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('home_setup_regions', [
      {
        id: 455,
        company_id: 123987,
        banner_url_low_res: 'low_resbanner',
        banner_url_high_res: 'high_res_banner',
        latitude: '1.000001',
        longitude: '2.000002',
        main_banner: true,
        active: true,
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('home_setup_regions', null, {});
  },
};
