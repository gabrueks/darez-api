module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('companies', [
      {
        id: 123987,
        user_id: 987652,
        document: '12345609877',
        fantasy_name: 'Company Fantasy Name',
        phone_country_code: '55',
        phone_area_code: '99',
        phone_number: '987984329',
        cep: '01234090',
        street: 'Street',
        street_number: '123',
        neighborhood: 'Neighborhood',
        city: 'Sao Paulo',
        state: 'SP',
        latitude: '1.000001',
        longitude: '2.000002',
        endpoint: 'endpointunique',
        asaas_account_key: 'asaasAccountKey',
        asaas_login_email: 'email@asaasmail.com',
        asaas_wallet_id: 'asaasWalletId',
        asaas_object: 'asaasObject',
      },
    ], {});

    await queryInterface.bulkInsert('business_hours', [
      {
        company_id: 123987,
        monday_open: '12:00:00',
        monday_close: '17:00:00',
        wednesday_open: '12:00:00',
        wednesday_close: '17:00:00',
        friday_open: '12:00:00',
        friday_close: '17:00:00',
      },
    ], {});

    await queryInterface.bulkInsert('company_payments', [
      {
        company_id: 123987,
        method: 'Crédito',
      },
      {
        company_id: 123987,
        method: 'Débito',
      },
      {
        company_id: 123987,
        method: 'Dinheiro',
      },
      {
        company_id: 123987,
        method: 'Cartão',
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('company_payments', null, {});
    await queryInterface.bulkDelete('business_hours', null, {});
    await queryInterface.bulkDelete('companies', null, {});
  },
};
