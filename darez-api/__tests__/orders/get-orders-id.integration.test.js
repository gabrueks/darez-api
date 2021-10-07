const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const { unauthorized, invalidRequest } = require('../../web/v1/helpers');

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

describe('GET /orders/:ID', () => {
  let server;
  let connection;
  let login;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987654387'; // User from group 2

  const testData = {
    id: 'id-do-pedido',
    id2: 'id-do-pedido2',
    company_id: 123987,
    buyer: 987653,
    cep: '02462050',
    street: 'R. Jauari',
    street_number: 57,
    neighborhood: 'Chora Menino',
    city: 'São Paulo',
    state: 'SP',
    price: '25.15',
    price2: '50.30',
    payment_method: 'Dinheiro',
    status: 'Solicitado',
    active: 1,
  };

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
    await connection.promise().query('DELETE FROM user_login');
    await connection.end();
  });

  it('shoud return unauthorized if no valid token is sent', async () => {
    const response = await request(server).get(`/v1/orders/${testData.id}`).send();
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: unauthorized });
  });

  it('shoud return an error if no order is found with given id', async () => {
    const response = await request(server).get('/v1/orders/gib-data')
      .set('Authorization', login.body.access_token)
      .send();
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: invalidRequest });
  });

  it('shoud return order data to logged in user', async () => {
    const response = await request(server).get(`/v1/orders/${testData.id}`)
      .set('Authorization', login.body.access_token)
      .send();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      company_id: 123987,
      buyer: 987653,
      cep: '02462050',
      street: 'R. Jauari',
      street_number: 57,
      address_2: null,
      neighborhood: 'Chora Menino',
      city: 'São Paulo',
      state: 'SP',
      price: '25.15',
      payment_method: 'Dinheiro',
      status: 'Solicitado',
      order_products: [
        {
          quantity: 1,
          name: 'Product Name',
          description: 'Some description',
          category: 'CategoryTwo',
          subcategory: 'SubCategoryTwo',
          product_id: 123987,
          product_variation_id: null,
          unity_price: 123988,
          promotion_price: '25.15',
          photo_key: 'photo_key1',
        },
      ],
      count_products: '1',
      buyer_info: {
        phone_country_code: '55',
        phone_area_code: '99',
        phone_number: '987654387',
        full_name: 'Full All Name',
      },
      company_info: {
        phone_country_code: '55',
        phone_area_code: '99',
        phone_number: '987984329',
        fantasy_name: 'Company Fantasy Name',
      },
      bucket_url: 'bucketUrl',
    });
  });
});
