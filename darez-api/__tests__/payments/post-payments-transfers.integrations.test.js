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

describe('POST /v1/payments/transfers', () => {
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

  it('should create a new transfer to the company', async () => {
    const mockSaveAxios = axios.post.mockImplementation(() => ({
      data: {
        id: 'asaas_id',
        dateCreated: '2020-10-07',
        object: 'transfer',
        value: 10.89,
        netValue: 10.89,
        status: 'PENDING',
        transferFee: 5,
        transactionReceiptUrl: null,
        scheduleDate: '2020-10-08',
        authorized: true,
      },
    }));

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

    const [[infoAsaasTransferDataBefore]] = await connection.promise().query('SELECT * FROM asaas_transfer_data WHERE company_id=123987');

    const response = await request(server).post('/v1/payments/transfers').set('Authorization', login.body.access_token).send({
      value: 10,
      bank_code: '123',
      owner_name: 'Owner Name',
      document: '12345678955',
      agency: '11',
      account: '22',
      account_type: 'CONTA_CORRENTE',
      account_digit: 'CORRENTE',
    });

    const [[infoAsaasTransferDataAfter]] = await connection.promise().query('SELECT * FROM asaas_transfer_data WHERE company_id=123987');
    await connection.promise().query('DELETE FROM asaas_transfer_data WHERE company_id=123987');

    expect(response.status).toEqual(201);
    expect(infoAsaasTransferDataBefore).toBeFalsy();

    expect(infoAsaasTransferDataAfter.company_id).toEqual(123987);
    expect(infoAsaasTransferDataAfter.asaas_id).toEqual('asaas_id');
    expect(infoAsaasTransferDataAfter.asaas_object).toEqual('transfer');
    expect(infoAsaasTransferDataAfter.value).toEqual('10.89');
    expect(infoAsaasTransferDataAfter.net_value).toEqual('10.89');
    expect(infoAsaasTransferDataAfter.asaas_status).toEqual('PENDING');
    expect(infoAsaasTransferDataAfter.asaas_transfer_fee).toEqual('5.00');
    expect(infoAsaasTransferDataAfter.asaas_transaction_receipt_url).toEqual(null);
    expect(infoAsaasTransferDataAfter.asaas_authorized).toEqual('1');

    mockSaveAxios.mockRestore();
  });

  it('should returned unavailable amount when a company does not have enough money', async () => {
    /* eslint-disable */
    const mockSaveAxios = axios.post.mockImplementation(() => {
      throw ({
        response: {
          status: 400,
          data: {
            errors: [{
              code: 'invalid_action',
            }],
          }
        }
      });
    });
    /* eslint-enable */

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

    const response = await request(server).post('/v1/payments/transfers').set('Authorization', login.body.access_token).send({
      value: 10,
      bank_code: '123',
      owner_name: 'Owner Name',
      document: '12345678955',
      agency: '11',
      account: '22',
      account_type: 'CONTA_CORRENTE',
      account_digit: 'CORRENTE',
    });

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual('Saldo insuficiente');

    mockSaveAxios.mockRestore();
  });

  it('should returned forbidden of error when a company does not has an account', async () => {
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

    const response = await request(server).post('/v1/payments/transfers').set('Authorization', login.body.access_token).send({
      value: 10,
      bank_code: '123',
      owner_name: 'Owner Name',
      document: '12345678955',
      agency: '11',
      account: '22',
      account_type: 'CONTA_CORRENTE',
      account_digit: 'CORRENTE',
    });

    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual('Proibido');
  });

  it('should return status of bad request when missing argument', async () => {
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

    const response = await request(server).post('/v1/payments/transfers').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).post('/v1/payments/transfers').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
