module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('home_setup_regions',
      'lat',
      'latitude');
    await queryInterface.renameColumn('home_setup_regions',
      'lng',
      'longitude');
    await queryInterface.renameColumn('home_setup_regions',
      'main_shop',
      'main_banner');
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('home_setup_regions',
      'latitude',
      'lat');

    await queryInterface.renameColumn('home_setup_regions',
      'longitude',
      'lng');

    await queryInterface.renameColumn('home_setup_regions',
      'main_banner',
      'main_shop');
  },

};
