module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        id: 987654,
        phone_country_code: '55',
        phone_area_code: '99',
        phone_number: '987654329',
        confirmation_code: '123456',
        full_name: 'Full Name',
        user_group: 1,
        confirmation_code_requested_at: '2020-10-11 00:01:00',
        document: '12345678955',
<<<<<<< HEAD
        access_token: 'defaultToken',
        refresh_token: 'refreshToken',
=======
        web_access_token: 'defaultToken',
        web_refresh_token: 'refreshToken',
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      },
      {
        id: 987653,
        phone_country_code: '55',
        phone_area_code: '99',
        phone_number: '987654387',
        confirmation_code: '123456',
        full_name: 'Full All Name',
        user_group: 2,
        confirmation_code_requested_at: '2020-10-11 00:01:00',
        document: '12345678956',
<<<<<<< HEAD
        access_token: 'defaultToken',
        refresh_token: 'refreshToken',
=======
        web_access_token: 'defaultToken',
        web_refresh_token: 'refreshToken',
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      },
      {
        id: 987652,
        phone_country_code: '55',
        phone_area_code: '99',
        phone_number: '987984329',
        confirmation_code: '123456',
        full_name: 'Full More Name',
        user_group: 3,
        confirmation_code_requested_at: '2020-10-11 00:01:00',
        document: '12345678957',
<<<<<<< HEAD
        access_token: 'defaultToken',
        refresh_token: 'refreshToken',
=======
        web_access_token: 'defaultToken',
        web_refresh_token: 'refreshToken',
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
