module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('products', [
      {
        id: 123987,
        company_id: 123987,
        name: 'Product Name',
        description: 'Some description',
        price: 12.99,
        category: 'CategoryTwo',
        subcategory: 'SubCategoryTwo',
        sort_id: 1,
      },
    ], {});

    await queryInterface.bulkInsert('product_photos', [
      {
        id: 123987,
        product_id: 123987,
        photo_key: 'photo_key1',
        thumbnail: 'thumbnail1',
        is_main: 1,
      },
      {
        id: 123988,
        product_id: 123987,
        photo_key: 'photo_key2',
        thumbnail: 'thumbnail2',
        is_main: 0,
      },
    ], {});

    await queryInterface.bulkInsert('product_variations', [
      {
        id: 123987,
        product_id: 123987,
        color: 'red',
        size: 'P',
      },
      {
        id: 123988,
        product_id: 123987,
        color: 'red',
        size: 'M',
      },
      {
        id: 123989,
        product_id: 123987,
        color: 'blue',
        size: 'G',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('product_variations', null, {});
    await queryInterface.bulkDelete('product_photos', null, {});
    await queryInterface.bulkDelete('products', null, {});
  },
};
