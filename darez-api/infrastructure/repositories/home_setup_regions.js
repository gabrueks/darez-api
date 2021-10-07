const { Op } = require('sequelize');
const { calculateDistance } = require('./helper');

module.exports = class HomeSetupRegionsRepository {
  constructor(database) {
    this.database = database;
  }

  /**
     * Find all companies from informamed range.
     *
     * @param {string} region region location
     * @param {boolean} allBanners get all shop of area
     * @param {integer} range to get banners main or not (@default = 10)
     */
  findAllShopBanners(localization, allBanners, range) {
    const distance = calculateDistance(localization);
    return this.database.HomeSetupRegions.findAll({
      attributes: [
        'banner_url_high_res',
        'banner_url_low_res',
        'main_banner',
        [this.database.Sequelize.literal(distance), 'distance']],
      where: {
        active: 1, main_banner: allBanners ? 1 : 0 || 1,
      },
      having: {
        distance: { [Op.lte]: range || 10 },
      },
    });
  }
};
