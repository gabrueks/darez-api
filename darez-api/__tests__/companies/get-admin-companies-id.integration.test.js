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

describe('GET /v1/admin/companies/:ID', () => {
  let server;
  let connection;
  const userPhoneCountryCode = '55';
  const userPhoneAreaCode = '99';
  const userPhoneNumber = '987654329';
  const adminPhoneCountryCode = '55';
  const adminPhoneAreaCode = '99';
  const adminPhoneNumber = '987654387';

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

  it('should get a company info when admin user', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).get('/v1/admin/companies/123987').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(200);
    expect(response.body.fantasy_name).toEqual('Company Fantasy Name');
    expect(response.body.delivery_range).toEqual(5);
    expect(response.body.endpoint).toEqual('endpointunique');
    expect(response.body.latitude).toEqual(1.000001);
    expect(response.body.longitude).toEqual(2.000002);
    expect(response.body.phone_country_code).toEqual('55');
    expect(response.body.phone_area_code).toEqual('99');
    expect(response.body.phone_number).toEqual('987984329');
  });

  it('should return unauthorized when requested with unauthorized token', async () => {
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

    const response = await request(server).get('/v1/admin/companies/123987').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).get('/v1/admin/companies/123987').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
