const create = require('./create');
const findPhotos = require('./findPhotos');
const updateImage = require('./updateImage');
const deleteImage = require('./deleteImage');
const update = require('./update');
const logicalDelete = require('./logicalDelete');
const findProductsSubcategory = require('./findProductsSubcategory');
const findOne = require('./findOne');
const findProductVariations = require('./findProductVariations');
const deleteProdVariation = require('./deleteProdVariation');
const updateImageApp = require('./updateImageApp');
const findPreferences = require('./findPreferences');
const sorting = require('./sorting');

module.exports = {
  ...create,
  ...findPhotos,
  ...updateImage,
  ...deleteImage,
  ...update,
  ...logicalDelete,
  ...findProductsSubcategory,
  ...findOne,
  ...findProductVariations,
  ...deleteProdVariation,
  ...updateImageApp,
  ...findPreferences,
  ...sorting,
};
