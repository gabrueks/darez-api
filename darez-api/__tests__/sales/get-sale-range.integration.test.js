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

jest.mock('../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('GET /v1/sales/range', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987984329';

  beforeAll(async () => {
    server = await app();
    connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      port: DB_PORT,
    });
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should get sales info from company in date range', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).get('/v1/sales/range').set('Authorization', login.body.access_token).query({
      end: '10/10/2010',
      start: '10/10/2010',
    });

    expect(response.status).toEqual(200);
    expect(response.body[0].description).toEqual('description');
    expect(response.body[0].price).toEqual('10.00');
    expect(response.body[0].client_id).toEqual(1234);
    expect(response.body[0].sale_method).toEqual('Dinheiro');
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).get('/v1/sales').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'N??o autorizado',
    });
  });
});
