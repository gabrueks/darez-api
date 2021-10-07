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

describe('POST /v1/users', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '918273645';

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
        confirmation_code_requested_at)
    VALUES
      (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456', '2020-10-11 00:01:00')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should create an user and return 201', async () => {
    const response = await request(server).post('/v1/users').send({
      phone_country_code: '44',
      phone_area_code: '11',
      phone_number: '918273645',
      type: 'WTS',
      is_consultant: true,
    });
    const [dbCheck] = await connection.promise().query('SELECT * FROM users WHERE phone_country_code=\'44\' AND phone_area_code=\'11\' AND phone_number=\'918273645\'');
    await connection.promise().query('DELETE FROM users WHERE phone_country_code=\'44\' AND phone_area_code=\'11\' AND phone_number=\'918273645\'');

    expect(dbCheck.length).toEqual(1);
    expect(dbCheck[0]).toHaveProperty('phone_country_code');
    expect(dbCheck[0]).toHaveProperty('phone_area_code');
    expect(dbCheck[0]).toHaveProperty('phone_number');
    expect(response.status).toEqual(201);
  });

  it('should log an user in and return 204', async () => {
    const response = await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    expect(response.status).toEqual(204);
  });
});
