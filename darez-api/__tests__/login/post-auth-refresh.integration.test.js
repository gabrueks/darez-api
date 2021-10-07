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

describe('POST /v1/auth/refresh', () => {
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
      (12345, '${phoneCountryCode}', '${phoneAreaCode}', '${phoneNumber}', '123456', '2020-10-11 00:01:00',
        'Full Name')`);
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
  it('should refresh an user token when all data is good', async () => {
=======
  it('should refresh an user token when all data is good when web', async () => {
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
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

<<<<<<< HEAD
    const [[infoBefore]] = await connection.promise().query('SELECT access_token, refresh_token FROM users WHERE id=12345');
=======
    const [[infoBefore]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

    const response = await request(server).post('/v1/auth/refresh').send({
      access_token: login.body.access_token,
      refresh_token: login.body.refresh_token,
    });

<<<<<<< HEAD
    const [[infoAfter]] = await connection.promise().query('SELECT access_token, refresh_token FROM users WHERE id=12345');
=======
    const [[infoAfter]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');

<<<<<<< HEAD
    expect(login.body.access_token).toEqual(infoBefore.access_token);
    expect(login.body.refresh_token).toEqual(infoBefore.refresh_token);

    expect(response.body.access_token).toEqual(infoAfter.access_token);
    expect(response.body.refresh_token).toEqual(infoAfter.refresh_token);
=======
    expect(infoBefore.web_access_token).toEqual(login.body.access_token);
    expect(infoBefore.web_refresh_token).toEqual(login.body.refresh_token);
    expect(infoBefore.app_access_token).toEqual(null);
    expect(infoBefore.app_refresh_token).toEqual(null);

    expect(infoAfter.web_access_token).toEqual(response.body.access_token);
    expect(infoAfter.web_refresh_token).toEqual(response.body.refresh_token);
    expect(infoAfter.app_access_token).toEqual(null);
    expect(infoAfter.app_refresh_token).toEqual(null);
  });

  it('should refresh an user token when all data is good when app', async () => {
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
      host: 'http://app',
    });

    const [[infoBefore]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

    const response = await request(server).post('/v1/auth/refresh').send({
      access_token: login.body.access_token,
      refresh_token: login.body.refresh_token,
      host: 'http://app',
    });

    const [[infoAfter]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');

    expect(infoBefore.web_access_token).toEqual(null);
    expect(infoBefore.web_refresh_token).toEqual(null);
    expect(infoBefore.app_access_token).toEqual(login.body.access_token);
    expect(infoBefore.app_refresh_token).toEqual(login.body.refresh_token);

    expect(infoAfter.web_access_token).toEqual(null);
    expect(infoAfter.web_refresh_token).toEqual(null);
    expect(infoAfter.app_access_token).toEqual(response.body.access_token);
    expect(infoAfter.app_refresh_token).toEqual(response.body.refresh_token);
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
  });

  it('should return status of bad request when missing argument', async () => {
    const response = await request(server).post('/v1/auth/refresh').send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized response when send an invalid token', async () => {
    const response = await request(server).post('/v1/auth/refresh').send({
      access_token: 'invalidToken',
      refresh_token: 'invalidToken2',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
  });
});
