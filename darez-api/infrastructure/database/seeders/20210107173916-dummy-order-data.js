module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('orders', [
      {
        id: 'id-do-pedido',
        company_id: 123987,
        buyer: 987653,
        cep: '02462050',
        street: 'R. Jauari',
        street_number: 57,
        neighborhood: 'Chora Menino',
        city: 'São Paulo',
        state: 'SP',
        price: '25.15',
        payment_method: 'Dinheiro',
        status: 'Solicitado',
        active: 1,
      },
      {
        id: 'id-do-pedido2',
        company_id: 123987,
        buyer: 987653,
        cep: '02462050',
        street: 'R. Jauari',
        street_number: 57,
        neighborhood: 'Chora Menino',
        city: 'São Paulo',
        state: 'SP',
        price: '50.30',
        payment_method: 'Dinheiro',
        status: 'Solicitado',
        active: 1,
      },
    ]);

    await queryInterface.bulkInsert('order_products', [
      {
        id: 4325,
        order_id: 'id-do-pedido',
        product_id: 123987,
        product_variation_id: 123988,
        quantity: 1,
        unity_price: '25.15',
        company_id: 123987,
        name: 'Product Name',
        description: 'Some description',
        category: 'CategoryTwo',
        subcategory: 'SubCategoryTwo',
        color: 'red',
        size: 'M',
      },
      {
        id: 4326,
        order_id: 'id-do-pedido2',
        product_id: 123987,
        product_variation_id: 123988,
        quantity: 2,
        unity_price: '25.15',
        company_id: 123987,
        name: 'Product Name',
        description: 'Some description',
        category: 'CategoryTwo',
        subcategory: 'SubCategoryTwo',
        color: 'red',
        size: 'M',
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('orders', null, {});
    await queryInterface.bulkDelete('order_products', null, {});
  },
};
