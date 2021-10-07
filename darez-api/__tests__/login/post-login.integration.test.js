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

describe('POST /v1/login', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345678';

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
      (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456', '2020-10-11 00:01:00', 'Full Name')`);
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

<<<<<<< HEAD
  it('should log user in and return some data', async () => {
=======
  it('should log user in and return some data when web', async () => {
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });
<<<<<<< HEAD
=======
    const [[infoBefore]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

    const response = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

<<<<<<< HEAD
=======
    const [[infoAfter]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user_group');
    expect(response.body).toHaveProperty('refresh_token');
    expect(response.body.full_name).toEqual('Full Name');
    expect(response.body.a_b_group).toEqual(0);
    expect(response.body.company_id).toEqual(null);

    expect(infoBefore.web_access_token).toEqual(null);
    expect(infoBefore.web_refresh_token).toEqual(null);
    expect(infoBefore.app_access_token).toEqual(null);
    expect(infoBefore.app_refresh_token).toEqual(null);

    expect(infoAfter.web_access_token).toEqual(response.body.access_token);
    expect(infoAfter.web_refresh_token).toEqual(response.body.refresh_token);
    expect(infoAfter.app_access_token).toEqual(null);
    expect(infoAfter.app_refresh_token).toEqual(null);
  });

  it('should log user in and return some data when app', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const [[infoBefore]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

    const response = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
      host: 'http://app',
    });

    const [[infoAfter]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user_group');
    expect(response.body).toHaveProperty('refresh_token');
    expect(response.body.full_name).toEqual('Full Name');
    expect(response.body.a_b_group).toEqual(0);
    expect(response.body.company_id).toEqual(null);
<<<<<<< HEAD
=======

    expect(infoBefore.web_access_token).toEqual(null);
    expect(infoBefore.web_refresh_token).toEqual(null);
    expect(infoBefore.app_access_token).toEqual(null);
    expect(infoBefore.app_refresh_token).toEqual(null);

    expect(infoAfter.web_access_token).toEqual(null);
    expect(infoAfter.web_refresh_token).toEqual(null);
    expect(infoAfter.app_access_token).toEqual(response.body.access_token);
    expect(infoAfter.app_refresh_token).toEqual(response.body.refresh_token);
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
  });
});
