const { NewProductSchema } = require('./create-product');
const { DeleteProductImageSchema } = require('./delete-product-images');
const { UpdateProductSchema } = require('./update-product');
const { DeleteProductVariationSchema } = require('./delete-product-variation');
const { LogicalDeleteProductSchema } = require('./logical-delete-product-schema');
const { UpdateImageSchema } = require('./update-image');
const { SortingSchema } = require('./sorting-product');

module.exports = {
  NewProductSchema,
  DeleteProductImageSchema,
  UpdateProductSchema,
  DeleteProductVariationSchema,
  LogicalDeleteProductSchema,
  UpdateImageSchema,
  SortingSchema,
};
