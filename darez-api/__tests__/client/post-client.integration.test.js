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

describe('POST /v1/clients', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987984329';

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

  it('should create a new company client', async () => {
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

    const response = await request(server).post('/v1/clients').set('Authorization', login.body.access_token).send({
      name: 'Name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
    });

    const [dbCheckClient] = await connection.promise().query('SELECT id, name, phone_country_code, phone_area_code, phone_number FROM company_clients WHERE company_id=123987');
    await connection.promise().query(`DELETE FROM company_clients WHERE id=${dbCheckClient[1].id}`);

    expect(response.status).toEqual(201);
    expect(dbCheckClient[1].name).toEqual('Name');
    expect(dbCheckClient[1].phone_country_code).toEqual('55');
    expect(dbCheckClient[1].phone_area_code).toEqual('11');
    expect(dbCheckClient[1].phone_number).toEqual('912345678');
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

    const response = await request(server).post('/v1/clients').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when requested with unauthorized token', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987654329',
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987654329',
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).post('/v1/clients').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).post('/v1/clients').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
