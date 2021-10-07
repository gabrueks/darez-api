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

jest.mock('../../infrastructure/adapters/maps', () => ({
  geocoder: {
    geocode: jest.fn(() => [{ latitude: 1, longitude: 2 }]),
  },
}));

describe('POST /v1/companies', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';

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
    const [[defaultGroup]] = await connection.promise().query(`SELECT
        id FROM user_groups WHERE name='default'`);
    await connection.promise().query(`INSERT INTO users
      (id, phone_country_code, phone_area_code, phone_number, confirmation_code,
        confirmation_code_requested_at, full_name, user_group)
    VALUES
      (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456', '2020-10-11 00:01:00', 'Full Name',
        ${defaultGroup.id})`);
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
  it('should create a new company', async () => {
=======
  it('should create a new company when login from web', async () => {
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
    const [[userBefore]] = await connection.promise().query('SELECT access_token, refresh_token FROM users WHERE id=12345');
=======
    const [[userBefore]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81

    const response = await request(server).post('/v1/companies').set('Authorization', login.body.access_token).send({
      cep: '09876513',
      state: 'SP',
      city: 'Sao Paulo',
      street: 'Rua Quata',
      street_number: 1000,
      neighborhood: 'Vila Olimpia',
      fantasy_name: 'Nome Fantasia',
      document: '92837162543',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '633461236',
      schedule: [
        { day: 1, open_time: '12:38', close_time: '17:00' },
        { day: 2, open_time: '02:00', close_time: '13:45' },
        { day: 4, open_time: '09:00', close_time: '15:30' },
        { day: 7, open_time: '08:40', close_time: '09:55' },
      ],
    });

    const [[dbCheckCompany]] = await connection.promise().query('SELECT id, user_id, fantasy_name, document, endpoint FROM companies WHERE user_id=12345');
    const [[dbCheckSchedule]] = await connection.promise().query(`SELECT * FROM business_hours WHERE company_id=${dbCheckCompany.id}`);
    const [dbCheckPayment] = await connection.promise().query(`SELECT method FROM company_payments WHERE company_id=${dbCheckCompany.id}`);
<<<<<<< HEAD
    const [[userAfter]] = await connection.promise().query('SELECT access_token, refresh_token FROM users WHERE id=12345');
=======
    const [[userAfter]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

    await connection.promise().query(`DELETE FROM business_hours WHERE company_id=${dbCheckCompany.id}`);
    await connection.promise().query(`DELETE FROM company_payments WHERE company_id=${dbCheckCompany.id}`);
    await connection.promise().query('DELETE FROM companies WHERE user_id=12345');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user_group');
    expect(response.body.user_group).toEqual(3);
    expect(dbCheckCompany.user_id).toEqual(12345);
    expect(dbCheckCompany.fantasy_name).toEqual('Nome Fantasia');
    expect(dbCheckCompany.endpoint).toEqual('nomefantasia');
    expect(dbCheckCompany.document).toEqual('92837162543');
    expect(dbCheckSchedule.monday_open).toEqual('12:38:00');
    expect(dbCheckSchedule.monday_close).toEqual('17:00:00');
    expect(dbCheckSchedule.thusday_open).toEqual('02:00:00');
    expect(dbCheckSchedule.thusday_close).toEqual('13:45:00');
    expect(dbCheckSchedule.wednesday_open).toEqual(null);
    expect(dbCheckSchedule.wednesday_close).toEqual(null);
    expect(dbCheckSchedule.saturday_open).toEqual(null);
    expect(dbCheckSchedule.saturday_close).toEqual(null);
    expect(dbCheckPayment.length).toEqual(3);
    expect(dbCheckPayment).toContainEqual({ method: 'Crédito' }, { method: 'Débito' }, { method: 'Dinheiro' });

    expect(userBefore.web_access_token).toEqual(login.body.access_token);
    expect(userBefore.web_refresh_token).toEqual(login.body.refresh_token);
    expect(userBefore.app_access_token).toEqual(null);
    expect(userBefore.app_refresh_token).toEqual(null);

    expect(userAfter.web_access_token).toEqual(response.body.access_token);
    expect(userAfter.web_refresh_token).toEqual(userBefore.web_refresh_token);
    expect(userAfter.app_access_token).toEqual(response.body.access_token);
    expect(userAfter.app_refresh_token).toEqual(userBefore.app_refresh_token);
  });

  it('should create a new company when login from app', async () => {
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

    const [[userBefore]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');

    const response = await request(server).post('/v1/companies').set('Authorization', login.body.access_token).send({
      cep: '09876513',
      state: 'SP',
      city: 'Sao Paulo',
      street: 'Rua Quata',
      street_number: 1000,
      neighborhood: 'Vila Olimpia',
      fantasy_name: 'Nome Fantasia',
      document: '92837162543',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '633461236',
      schedule: [
        { day: 1, open_time: '12:38', close_time: '17:00' },
        { day: 2, open_time: '02:00', close_time: '13:45' },
        { day: 4, open_time: '09:00', close_time: '15:30' },
        { day: 7, open_time: '08:40', close_time: '09:55' },
      ],
    });

    const [[dbCheckCompany]] = await connection.promise().query('SELECT id, user_id, fantasy_name, document, endpoint FROM companies WHERE user_id=12345');
    const [[dbCheckSchedule]] = await connection.promise().query(`SELECT * FROM business_hours WHERE company_id=${dbCheckCompany.id}`);
    const [dbCheckPayment] = await connection.promise().query(`SELECT method FROM company_payments WHERE company_id=${dbCheckCompany.id}`);
    const [[userAfter]] = await connection.promise().query('SELECT web_access_token, web_refresh_token, app_access_token, app_refresh_token FROM users WHERE id=12345');
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
    await connection.promise().query(`DELETE FROM business_hours WHERE company_id=${dbCheckCompany.id}`);
    await connection.promise().query(`DELETE FROM company_payments WHERE company_id=${dbCheckCompany.id}`);
    await connection.promise().query('DELETE FROM companies WHERE user_id=12345');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user_group');
    expect(response.body.user_group).toEqual(3);
    expect(dbCheckCompany.user_id).toEqual(12345);
    expect(dbCheckCompany.fantasy_name).toEqual('Nome Fantasia');
    expect(dbCheckCompany.endpoint).toEqual('nomefantasia');
    expect(dbCheckCompany.document).toEqual('92837162543');
    expect(dbCheckSchedule.monday_open).toEqual('12:38:00');
    expect(dbCheckSchedule.monday_close).toEqual('17:00:00');
    expect(dbCheckSchedule.thusday_open).toEqual('02:00:00');
    expect(dbCheckSchedule.thusday_close).toEqual('13:45:00');
    expect(dbCheckSchedule.wednesday_open).toEqual(null);
    expect(dbCheckSchedule.wednesday_close).toEqual(null);
    expect(dbCheckSchedule.saturday_open).toEqual(null);
    expect(dbCheckSchedule.saturday_close).toEqual(null);
    expect(dbCheckPayment.length).toEqual(3);
    expect(dbCheckPayment).toContainEqual({ method: 'Crédito' }, { method: 'Débito' }, { method: 'Dinheiro' });

<<<<<<< HEAD
    expect(login.body.access_token).toEqual(userBefore.access_token);
    expect(login.body.refresh_token).toEqual(userBefore.refresh_token);

    expect(response.body.access_token).toEqual(userAfter.access_token);
    expect(userBefore.refresh_token).toEqual(userAfter.refresh_token);
=======
    expect(userBefore.web_access_token).toEqual(null);
    expect(userBefore.web_refresh_token).toEqual(null);
    expect(userBefore.app_access_token).toEqual(login.body.access_token);
    expect(userBefore.app_refresh_token).toEqual(login.body.refresh_token);

    expect(userAfter.web_access_token).toEqual(response.body.access_token);
    expect(userAfter.web_refresh_token).toEqual(userBefore.web_refresh_token);
    expect(userAfter.app_access_token).toEqual(response.body.access_token);
    expect(userAfter.app_refresh_token).toEqual(userBefore.app_refresh_token);
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
  });

  it('should return status of bad request when missing argument', async () => {
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

    const response = await request(server).post('/v1/companies').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).post('/v1/companies').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
