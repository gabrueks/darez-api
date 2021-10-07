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

describe('GET /admin/orders/user/:ID', () => {
  let server;
  let connection;
  let login;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987654387'; // User from group 2

  const testData = {
    buyer: 987653,
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
    const response = await request(server).get(`/v1/admin/orders/user/${testData.buyer}`).send();
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: unauthorized });
  });

  it('shoud return forbidden if user has no valid rights', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: '987654329',
      type: 'WTS',
      is_consultant: true,
    });

    const nonAdminLogin = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: '987654329',
      confirmation_code: '289732',
      is_consultant: true,
    });
    const response = await request(server).get(`/v1/admin/orders/user/${testData.buyer}`)
      .set('Authorization', nonAdminLogin.body.access_token)
      .send();
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: unauthorized });
  });

  it('shoud return all orders from requested user', async () => {
    const response = await request(server).get(`/v1/admin/orders/user/${testData.buyer}`)
      .set('Authorization', login.body.access_token)
      .send();
    expect(response.status).toEqual(200);
    expect(response.body.orders).toHaveLength(2);
    expect(response.body).toMatchObject({
      bucket_url: 'bucketUrl',
    });
  });
});
