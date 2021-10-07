const create = require('./create');
const deleteBanner = require('./deleteBanner');
const deleteLogo = require('./deleteLogo');
const findAllCategory = require('./findAllCategory');
const findAllProducts = require('./findAllProducts');
const findCompanies = require('./findCompanies');
const findCompaniesRegion = require('./findCompaniesRegion');
const findNeighborhood = require('./findNeighborhood');
const findOneCompany = require('./findOneCompany');
const findProductsFromCategoryCompany = require('./findProductsFromCategoryCompany');
const getBanner = require('./getBanner');
const getLogo = require('./getLogo');
const update = require('./update');
const updateBanner = require('./updateBanner');
const updateLogo = require('./updateLogo');
const findOneEndpoint = require('./findOneEndpoint');
const findOneNoLogin = require('./findOneNoLogin');
const findEndpoints = require('./findEndpoints');
const getPaymentMethods = require('./getPaymentMethod');
const updateLogoApp = require('./updateLogoApp');
const updateBannerApp = require('./uploadBannerApp');
const findMainCompany = require('./findMainCompany');
const findOneLinkou = require('./findOneLinkou');

module.exports = {
  ...create,
  ...deleteBanner,
  ...deleteLogo,
  ...findAllCategory,
  ...findAllProducts,
  ...findCompanies,
  ...findCompaniesRegion,
  ...findNeighborhood,
  ...findOneCompany,
  ...findProductsFromCategoryCompany,
  ...getBanner,
  ...getLogo,
  ...update,
  ...updateBanner,
  ...updateLogo,
  ...findOneEndpoint,
  ...findOneNoLogin,
  ...findEndpoints,
  ...getPaymentMethods,
  ...updateLogoApp,
  ...updateBannerApp,
  ...findMainCompany,
  ...findOneLinkou,
};
