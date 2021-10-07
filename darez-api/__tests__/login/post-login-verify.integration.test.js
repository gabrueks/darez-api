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

describe('POST /v1/login/verify', () => {
  let server;
  let connection;

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

  beforeEach(async () => {
    await connection.promise().query(`INSERT INTO users
      (id, phone_country_code, phone_area_code, phone_number, confirmation_code,
        confirmation_code_requested_at, full_name)
    VALUES
      (12345, '55', '11', '912345678', '123456', '2020-10-11 00:01:00', 'Full Name')`);
    await connection.promise().query(`INSERT INTO companies
        (id, user_id, document, fantasy_name, cep, street, street_number, neighborhood, 
          city, state, latitude, longitude, phone_country_code, phone_area_code, phone_number)
      VALUES
        (54321, 12345, '12345678900', 'Fantasy Name', '01234090', 'Street', '123', 'Neighborhood',
        'Sao Paulo', 'SP', '1.000001', '2.000002', '55', '11', '912345678')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should verify that an user token is valid and return some data', async () => {
    const phoneCountryCode = '55';
    const phoneAreaCode = '11';
    const phoneNumber = '912345678';
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

    const response = await request(server).post('/v1/login/verify').send({
      token: login.body.access_token,
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      user_id: 12345,
      company_id: 54321,
    });
  });

  it('should return unauthorized response when send an invalid token', async () => {
    const response = await request(server).post('/v1/login/verify').send({
      token: 'invalid_token',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
  });
});
