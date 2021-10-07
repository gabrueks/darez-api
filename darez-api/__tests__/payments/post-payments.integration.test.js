const axios = require('axios');
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
  post: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
}));

describe('POST /v1/payments', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';
  const userPhoneCountryCode = '55';
  const userPhoneAreaCode = '99';
  const userPhoneNumber = '987654329';

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
          confirmation_code_requested_at, full_name, user_group)
      VALUES
        (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456', '2020-10-11 00:01:00', 'Full Name',
        1)`);
    await connection.promise().query(`INSERT INTO orders
      (id, company_id, buyer, cep, street, street_number, neighborhood, city, state,
        price, payment_method)
      VALUES
        (12345, 123987, 12345, '01234090', 'Street', '123', 'Neighborhood', 'Sao Paulo', 'SP', 15.99, 'Cartão'),
        (12346, 123987, 987654, '01234090', 'Street', '123', 'Neighborhood', 'Sao Paulo', 'SP', 15.99, 'Cartão')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM orders WHERE id IN (12345, 12346)');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should create a payment to an user that already has an asaas account with the company', async () => {
    const mockSaveAxios = axios.post.mockImplementationOnce(() => ({
      data: {
        object: 'payment',
        id: 'pay_id',
        status: 'CONFIRMADO',
        invoiceUrl: 'invoice_url',
        bankSlipUrl: 'bank_slip_url',
        netValue: 15.99,
        invoiceNumber: '123456789098',
      },
    }));

    await request(server).post('/v1/users').send({
      phone_country_code: userPhoneCountryCode,
      phone_area_code: userPhoneAreaCode,
      phone_number: userPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: userPhoneCountryCode,
      phone_area_code: userPhoneAreaCode,
      phone_number: userPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const [[infoBefore]] = await connection.promise().query('SELECT asaas_object, asaas_id, asaas_status, asaas_bank_slip_url, asaas_invoice_url, asaas_net_value, asaas_invoice_number FROM orders WHERE id=12346');

    const response = await request(server).post('/v1/payments').set('Authorization', login.body.access_token).send({
      order_id: '12346',
      card_holder: {
        document: '12345678933',
      },
      credit_card: {
        holder_name: 'Holders Name',
        number: '1234567890',
        expiry_month: '12',
        expiry_year: '2025',
        ccv: '123',
      },
    });

    const [[infoAfter]] = await connection.promise().query('SELECT asaas_object, asaas_id, asaas_status, asaas_bank_slip_url, asaas_invoice_url, asaas_net_value, asaas_invoice_number FROM orders WHERE id=12346');

    expect(response.status).toEqual(201);
    expect(infoBefore.asaas_object).toEqual(null);
    expect(infoBefore.asaas_id).toEqual(null);
    expect(infoBefore.asaas_status).toEqual(null);
    expect(infoBefore.asaas_bank_slip_url).toEqual(null);
    expect(infoBefore.asaas_invoice_url).toEqual(null);
    expect(infoBefore.asaas_net_value).toEqual(null);
    expect(infoBefore.asaas_invoice_number).toEqual(null);

    expect(infoAfter.asaas_object).toEqual('payment');
    expect(infoAfter.asaas_id).toEqual('pay_id');
    expect(infoAfter.asaas_status).toEqual('CONFIRMADO');
    expect(infoAfter.asaas_bank_slip_url).toEqual('bank_slip_url');
    expect(infoAfter.asaas_invoice_url).toEqual('invoice_url');
    expect(infoAfter.asaas_net_value).toEqual('15.99');
    expect(infoAfter.asaas_invoice_number).toEqual('123456789098');

    mockSaveAxios.mockRestore();
  });

  it('should create a payment to an user that does not has an asaas account with the company and create its account', async () => {
    const mockSaveAxios = axios.post
      .mockImplementationOnce(() => ({
        data: {
          id: 'asaas_id',
          dateCreated: '2020-01-01 00:01:00',
          object: 'client',
        },
      }))
      .mockImplementationOnce(() => ({
        data: {
          object: 'payment',
          id: 'pay_id',
          status: 'CONFIRMADO',
          invoiceUrl: 'invoice_url',
          bankSlipUrl: 'bank_slip_url',
          netValue: 15.99,
          invoiceNumber: '123456789098',
        },
      }));

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

    const [[infoBefore]] = await connection.promise().query('SELECT asaas_object, asaas_id, asaas_status, asaas_bank_slip_url, asaas_invoice_url, asaas_net_value, asaas_invoice_number FROM orders WHERE id=12345');
    const [[infoUserAsaasBefore]] = await connection.promise().query('SELECT * FROM user_asaas WHERE user_id=12345');

    const response = await request(server).post('/v1/payments').set('Authorization', login.body.access_token).send({
      order_id: '12345',
      card_holder: {
        document: '12345678933',
      },
      credit_card: {
        holder_name: 'Holders Name',
        number: '1234567890',
        expiry_month: '12',
        expiry_year: '2025',
        ccv: '123',
      },
    });

    const [[infoAfter]] = await connection.promise().query('SELECT asaas_object, asaas_id, asaas_status, asaas_bank_slip_url, asaas_invoice_url, asaas_net_value, asaas_invoice_number FROM orders WHERE id=12345');
    const [[infoUserAsaasAfter]] = await connection.promise().query('SELECT * FROM user_asaas WHERE user_id=12345');
    await connection.promise().query('DELETE FROM user_asaas WHERE user_id=12345');

    expect(response.status).toEqual(201);
    expect(infoBefore.asaas_object).toEqual(null);
    expect(infoBefore.asaas_id).toEqual(null);
    expect(infoBefore.asaas_status).toEqual(null);
    expect(infoBefore.asaas_bank_slip_url).toEqual(null);
    expect(infoBefore.asaas_invoice_url).toEqual(null);
    expect(infoBefore.asaas_net_value).toEqual(null);
    expect(infoBefore.asaas_invoice_number).toEqual(null);
    expect(infoUserAsaasBefore).toBeFalsy();

    expect(infoAfter.asaas_object).toEqual('payment');
    expect(infoAfter.asaas_id).toEqual('pay_id');
    expect(infoAfter.asaas_status).toEqual('CONFIRMADO');
    expect(infoAfter.asaas_bank_slip_url).toEqual('bank_slip_url');
    expect(infoAfter.asaas_invoice_url).toEqual('invoice_url');
    expect(infoAfter.asaas_net_value).toEqual('15.99');
    expect(infoUserAsaasAfter.user_id).toEqual(12345);
    expect(infoUserAsaasAfter.company_id).toEqual(123987);
    expect(infoUserAsaasAfter.asaas_id).toEqual('asaas_id');
    expect(infoUserAsaasAfter.asaas_object).toEqual('client');
    expect(infoUserAsaasAfter.asaas_account_key).toEqual('asaasAccountKey');

    mockSaveAxios.mockRestore();
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

    const response = await request(server).post('/v1/payments').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).post('/v1/payments').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
