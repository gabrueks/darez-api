module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user_groups', [
      {
        id: 1,
        name: 'default',
        get_all_companies: false,
        update_companies_banner: false,
        update_companies: false,
        delete_companies_banner: false,
        update_companies_logo: false,
        delete_companies_logo: false,
        create_product: false,
        update_product: false,
        delete_product: false,
        get_company_orders: false,
        update_product_image: false,
        delete_product_image: false,
        update_user: false,
        get_one_company: false,
        get_user_orders: false,
        get_one_order: false,
        get_one_user: false,
        get_all_user: false,
        create_promotion: false,
        update_promotion: false,
        delete_promotion: false,
        delete_product_variation: false,
        get_consultant: false,
        get_company_visits: false,
        get_asaas_balance: false,
        swap_product: false,
<<<<<<< HEAD
=======
        post_client: false,
        get_one_client: false,
        post_sale: false,
        get_all_client: false,
        put_client: false,
        get_sale: false,
        get_sales_range: false,
        get_sales_company: false,
        update_sale: false,
        get_all_sales_client: false,
        get_reports_kadernet: false,
        delete_sale: false,
        delete_client: false,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
        created_by: 'default',
      },
      {
        id: 2,
        name: 'admin',
        get_all_companies: true,
        update_companies_banner: true,
        update_companies: true,
        delete_companies_banner: true,
        update_companies_logo: true,
        delete_companies_logo: true,
        create_product: true,
        update_product: true,
        delete_product: true,
        update_product_image: true,
        delete_product_image: true,
        get_company_orders: true,
        get_user_orders: true,
        get_one_order: true,
        update_user: true,
        get_one_company: true,
        get_one_user: true,
        get_all_user: true,
        create_promotion: true,
        update_promotion: true,
        delete_promotion: true,
        delete_product_variation: true,
        get_consultant: true,
        get_company_visits: true,
        get_asaas_balance: true,
        swap_product: true,
<<<<<<< HEAD
=======
        post_client: false,
        get_one_client: false,
        post_sale: false,
        get_all_client: false,
        put_client: false,
        get_sale: false,
        get_sales_range: false,
        get_sales_company: false,
        update_sale: false,
        get_all_sales_client: false,
        get_reports_kadernet: false,
        delete_sale: false,
        delete_client: false,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
        created_by: 'default',
      },
      {
        id: 3,
        name: 'company_owner',
        get_all_companies: false,
        update_companies_banner: false,
        update_companies: false,
        delete_companies_banner: false,
        update_companies_logo: false,
        delete_companies_logo: false,
        create_product: true,
        update_product: true,
        delete_product: true,
        update_product_image: true,
        delete_product_image: true,
        get_company_orders: true,
        get_user_orders: false,
        get_one_order: false,
        update_user: false,
        get_one_company: false,
        get_one_user: false,
        get_all_user: false,
        create_promotion: true,
        update_promotion: true,
        delete_promotion: true,
        delete_product_variation: true,
        get_consultant: false,
        get_company_visits: true,
        get_asaas_balance: true,
        swap_product: true,
<<<<<<< HEAD
=======
        post_client: true,
        get_one_client: true,
        post_sale: true,
        get_all_client: true,
        put_client: true,
        get_sale: true,
        get_sales_range: true,
        get_sales_company: true,
        update_sale: true,
        get_all_sales_client: true,
        get_reports_kadernet: true,
        delete_sale: true,
        delete_client: true,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
        created_by: 'default',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_groups', null, {});
  },
};
