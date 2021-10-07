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

describe('GET /v1/reports/sales', () => {
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

  it('should return a base64 file with data', async () => {
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

    const response = await request(server).get('/v1/reports/sales').query({ start: '03/10/2010', end: '20/10/2010' }).set('Authorization', login.body.access_token)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('report');
  });

  it('should return bad request when missing start & end date', async () => {
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

    const response = await request(server).get('/v1/reports/sales').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: 'Inválido',
    });
  });

  it('should return unauthorized when requested with unauthorized token', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987654329',
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987654329',
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).get('/v1/reports/sales').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).get('/v1/reports/sales').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
