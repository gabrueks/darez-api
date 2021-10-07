module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      { name: 'Category 1', icon: 'icon', banner: 'banner' },
      { name: 'CategoryTwo', icon: 'icon/2', banner: 'banner2' },
      { name: 'Category Three', icon: 'icon3', banner: 'banner/3' },
      { name: 'Serviços', icon: 'servicon', banner: 'servbanner' },
    ], {});

    await queryInterface.bulkInsert('subcategories', [
      { name: 'Sub Category 1', category: 'Category 1' },
      { name: 'Others', category: 'Category 1' },
      { name: 'SubCategoryTwo', category: 'CategoryTwo' },
      { name: 'Others', category: 'CategoryTwo' },
      { name: 'Sub Category Three', category: 'Category Three' },
      { name: 'Others', category: 'Category Three' },
      { name: 'Others', category: 'Serviços' },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('subcategories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
