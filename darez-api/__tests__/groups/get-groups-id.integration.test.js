const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');

const {
  DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASS,
} = process.env;

jest.mock('../../web/v1/slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
}));

jest.mock('../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('GET /groups/:ID', () => {
  let server;
  let connection;
  let login;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987654329';

  beforeAll(async () => {
    server = await app();
    connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      port: DB_PORT,
    });
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    login = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should return the user group info for a logged in user', async () => {
    let response = await request(server).get('/v1/groups/1').set('Authorization', login.body.access_token).send();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      id: 1,
      name: 'default',
      get_all_companies: 0,
      update_companies_banner: 0,
      update_companies: 0,
      delete_companies_banner: 0,
      update_companies_logo: 0,
      delete_companies_logo: 0,
      create_product: 0,
      update_product: 0,
      delete_product: 0,
      get_company_orders: 0,
      update_product_image: 0,
      delete_product_image: 0,
      update_user: 0,
      get_one_company: 0,
      get_user_orders: 0,
      get_one_order: 0,
      get_one_user: 0,
      get_all_user: 0,
      create_promotion: 0,
      update_promotion: 0,
      delete_promotion: 0,
      delete_product_variation: 0,
      get_consultant: 0,
      get_company_visits: 0,
      get_asaas_balance: 0,
      swap_product: 0,
<<<<<<< HEAD
=======
      post_client: 0,
      post_sale: 0,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      created_by: 'default',
    });

    response = await request(server).get('/v1/groups/2').set('Authorization', login.body.access_token).send();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      id: 2,
      name: 'admin',
      get_all_companies: 1,
      update_companies_banner: 1,
      update_companies: 1,
      delete_companies_banner: 1,
      update_companies_logo: 1,
      delete_companies_logo: 1,
      create_product: 1,
      update_product: 1,
      delete_product: 1,
      update_product_image: 1,
      delete_product_image: 1,
      get_company_orders: 1,
      get_user_orders: 1,
      get_one_order: 1,
      update_user: 1,
      get_one_company: 1,
      get_one_user: 1,
      get_all_user: 1,
      create_promotion: 1,
      update_promotion: 1,
      delete_promotion: 1,
      delete_product_variation: 1,
      get_consultant: 1,
      get_company_visits: 1,
      get_asaas_balance: 1,
      swap_product: 1,
<<<<<<< HEAD
=======
      post_client: 0,
      post_sale: 0,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      created_by: 'default',
    });

    response = await request(server).get('/v1/groups/3').set('Authorization', login.body.access_token).send();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      id: 3,
      name: 'company_owner',
      get_all_companies: 0,
      update_companies_banner: 0,
      update_companies: 0,
      delete_companies_banner: 0,
      update_companies_logo: 0,
      delete_companies_logo: 0,
      create_product: 1,
      update_product: 1,
      delete_product: 1,
      update_product_image: 1,
      delete_product_image: 1,
      get_company_orders: 1,
      get_user_orders: 0,
      get_one_order: 0,
      update_user: 0,
      get_one_company: 0,
      get_one_user: 0,
      get_all_user: 0,
      create_promotion: 1,
      update_promotion: 1,
      delete_promotion: 1,
      delete_product_variation: 1,
      get_consultant: 0,
      get_company_visits: 1,
      get_asaas_balance: 1,
      swap_product: 1,
<<<<<<< HEAD
=======
      post_client: 1,
      post_sale: 1,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      created_by: 'default',
    });
  });

  it('should return null when group doesn\'t exist', async () => {
    // userGroup 7070 shouldn't exist
    const response = await request(server).get('/v1/groups/7070').set('Authorization', login.body.access_token).send();
    expect(response.body).toEqual(null);
    expect(response.status).toEqual(200);
  });

  it('should return unauthorized if requested by unauthorized user', async () => {
    const response = await request(server).get('/v1/groups/1').send();
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: 'Não autorizado' });
  });
});
