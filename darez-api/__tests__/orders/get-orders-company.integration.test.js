const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const { unauthorized } = require('../../web/v1/helpers');

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

describe('GET /orders/company', () => {
  let server;
  let connection;
  let login;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987984329'; // User from group 2

  //   const testData = {
  //     id: 'id-do-pedido',
  //     id2: 'id-do-pedido2',
  //     company_id: 123987,
  //     buyer: 987653,
  //     cep: '02462050',
  //     street: 'R. Jauari',
  //     street_number: 57,
  //     neighborhood: 'Chora Menino',
  //     city: 'São Paulo',
  //     state: 'SP',
  //     price: '25.15',
  //     price2: '50.30',
  //     payment_method: 'Dinheiro',
  //     status: 'Solicitado',
  //     active: 1,
  //   };

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
    const response = await request(server).get('/v1/orders/company').send();
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: unauthorized });
  });

  it('shoud return an empty array if user is not a company', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: '987654387',
      type: 'WTS',
      is_consultant: true,
    });

    const nonCompanyLogin = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: '987654387',
      confirmation_code: '289732',
      is_consultant: true,
    });
    const response = await request(server).get('/v1/orders/company')
      .set('Authorization', nonCompanyLogin.body.access_token)// .query({ ID: testData.company_id })
      .send();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ orders: [], pages: 0, bucket_url: 'bucketUrl' });
  });

  it('shoud return all orders from logged in company', async () => {
    const response = await request(server).get('/v1/orders/company')
      .set('Authorization', login.body.access_token)// .query({ ID: testData.company_id })
      .send();
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      pages: 1,
      bucket_url: 'bucketUrl',
    });
    expect(response.body.orders).toHaveLength(2);
  });
});
