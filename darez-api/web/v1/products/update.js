const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const ProductVariationRepository = require('../../../infrastructure/repositories/product_variation');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const { throwError } = require('../helpers');

const productRepository = new ProductRepository(database);
const productVariationRepository = new ProductVariationRepository(database);
const productPhotoRepository = new ProductPhotoRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  update: async ({ params, body }) => {
    const f = async (transaction) => {
      const { ID } = params;
      const { variations, main_image: mainImage } = body;

      await productRepository.update(ID, { ...body }, transaction);
      if (body.variations) {
        await Promise.all(variations.map(async (item) => {
          if (!item.id) {
            const variation = { ...item, productId: ID };
            await productVariationRepository.create(variation, transaction);
          } else {
            await productVariationRepository.update(ID, { ...item }, transaction);
          }
          return true;
        }));
      }
      if (mainImage) {
        const image = await productPhotoRepository.findMainOfProduct(['id'], ID, transaction);
        if (image) await productPhotoRepository.update(image.id, { is_main: false }, transaction);
        await productPhotoRepository.update(mainImage, { is_main: true }, transaction);
      }
      return httpResponse(204);
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (error) {
      return throwError(error, 'products/update');
    }
  },
};
