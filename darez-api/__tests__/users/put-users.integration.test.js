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

describe('PUT /v1/users', () => {
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
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE phone_country_code=\'55\' AND phone_area_code=\'11\' AND phone_number=\'912345678\'');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update an user and return 204', async () => {
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

    const [[infoBefore]] = await connection.promise().query('SELECT full_name, document FROM users WHERE id=12345');

    const response = await request(server).put('/v1/users').set('Authorization', login.body.access_token).send({
      full_name: 'New Name',
      document: '12345678977',
    });

    const [[infoAfter]] = await connection.promise().query('SELECT full_name, document FROM users WHERE id=12345');

    expect(response.status).toEqual(204);
    expect(infoBefore.full_name).toEqual('Full Name');
    expect(infoBefore.document).toEqual(null);
    expect(infoAfter.full_name).toEqual('New Name');
    expect(infoAfter.document).toEqual('12345678977');
    expect(response.body).toEqual({ });
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/users').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
