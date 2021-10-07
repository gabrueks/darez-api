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

jest.mock('../../infrastructure/adapters/maps', () => ({
  geocoder: {
    geocode: jest.fn(() => [{ latitude: 1, longitude: 2 }]),
  },
}));

jest.mock('axios', () => ({
  post: jest.fn(() => ({ data: { apiKey: 'api key', walletId: 'wallet id', object: 'account' } })),
  create: jest.fn(),
  get: jest.fn(),
}));

describe('POST /v1/payments/companies', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';
  const companyPhoneCountryCode = '55';
  const companyPhoneAreaCode = '99';
  const companyPhoneNumber = '987984329';

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
        id FROM user_groups WHERE name='company_owner'`);
    await connection.promise().query(`INSERT INTO users
        (id, phone_country_code, phone_area_code, phone_number, confirmation_code,
          confirmation_code_requested_at, full_name, user_group)
      VALUES
        (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456', '2020-10-11 00:01:00', 'Full Name',
        ${defaultGroup.id})`);
    await connection.promise().query(`INSERT INTO companies
      (id, user_id, document, fantasy_name, cep, street, street_number, neighborhood, 
        city, state, latitude, longitude, phone_country_code, phone_area_code, phone_number, endpoint)
      VALUES
        (54321, 12345, '12345678900', 'Fantasy Name', '01234090', 'Street', '123', 'Neighborhood',
          'Sao Paulo', 'SP', '3.000003', '4.000004', '55', '11', '912345678', 'endpoint')`);
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

  it('should create a payment account to a company that does not has one', async () => {
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

    const [[infoBefore]] = await connection.promise().query('SELECT asaas_account_key, asaas_login_email, asaas_wallet_id, asaas_object FROM companies WHERE id=54321');
    const [[infoPaymentMethodBefore]] = await connection.promise().query('SELECT * FROM company_payments WHERE company_id=54321');

    const response = await request(server).post('/v1/payments/companies').set('Authorization', login.body.access_token).send();

    const [[infoAfter]] = await connection.promise().query('SELECT asaas_account_key, asaas_login_email, asaas_wallet_id, asaas_object FROM companies WHERE id=54321');
    const [[infoPaymentMethodAfter]] = await connection.promise().query('SELECT * FROM company_payments WHERE company_id=54321');
    await connection.promise().query('DELETE FROM company_payments WHERE company_id=54321');

    expect(response.status).toEqual(201);
    expect(infoBefore.asaas_account_key).toEqual(null);
    expect(infoBefore.asaas_login_email).toEqual(null);
    expect(infoBefore.asaas_wallet_id).toEqual(null);
    expect(infoBefore.asaas_object).toEqual(null);
    expect(infoPaymentMethodBefore).toBeFalsy();

    expect(infoAfter).toHaveProperty('asaas_login_email');
    expect(infoAfter.asaas_account_key).toEqual('api key');
    expect(infoAfter.asaas_wallet_id).toEqual('wallet id');
    expect(infoAfter.asaas_object).toEqual('account');
    expect(infoPaymentMethodAfter.method).toEqual('Cartão');
    expect(infoPaymentMethodAfter.company_id).toEqual(54321);
  });

  it('should returned a status of error when a company already has an account', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).post('/v1/payments/companies').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Proibido');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).post('/v1/payments/companies').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
