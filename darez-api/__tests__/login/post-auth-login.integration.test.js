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

describe('POST /v1/auth/login', () => {
  let server;
  let connection;
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
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should find user an user and return 204', async () => {
    const response = await request(server).post('/v1/auth/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: false,
    });

    expect(response.status).toEqual(204);
  });

  it('should find user an user and return 204 when is_consultant = true', async () => {
    const response = await request(server).post('/v1/auth/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    expect(response.status).toEqual(204);
  });

  it('should return bad request when user does not exists', async () => {
    const response = await request(server).post('/v1/auth/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: '22',
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual('Usuário não cadastrado');
  });
});
