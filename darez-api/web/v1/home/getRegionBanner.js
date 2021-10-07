const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { toSlack } = require('../slack');
const homeDefaultBanner = require('../helpers/strings/homeDefaultBanner');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');
const HomeSetupRegionsRepository = require('../../../infrastructure/repositories/home_setup_regions');

const homeSetupRegionsRepository = new HomeSetupRegionsRepository(database);

const { AWS_BUCK_URL: bucketUrl } = process.env;

module.exports = {
  getBanners: async ({ query }, mainBanner = false) => {
    try {
      const { lat, lng, range } = query;
      if (lat && lng) {
        const banner = mainBanner ? await homeSetupRegionsRepository.findAllShopBanners(
          { lat, lng }, true, range,
        )
          : await homeSetupRegionsRepository.findAllShopBanners({ lat, lng }, false, range);
        if (banner.length > 0) {
          return httpResponse(200, { banners: banner, bucket_url: bucketUrl });
        }
      }
      return httpResponse(200, {
        banners: [
          {
            banner_url_high_res: homeDefaultBanner.HOME_DEFAULT_BANNER_RIGH_RES,
            banner_url_low_res: homeDefaultBanner.HOME_DEFAULT_BANNER_LOW_RES,
          },
        ],
        bucket_url: bucketUrl,
      });
    } catch (err) {
      toSlack(SLACK_ERR, err, 'home/getRegionBanner');
      return httpResponse(500);
    }
  },
};
