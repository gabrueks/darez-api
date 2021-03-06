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

describe('GET /v1/admin/companies', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987654329';
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

  it('should get all companies infos and return it to an admin user', async () => {
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

    const response = await request(server).get('/v1/admin/companies').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(200);
    expect(response.body.bucket_url).toEqual('bucketUrl');
    expect(response.body).toHaveProperty('companies');
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0].fantasy_name).toEqual('Company Fantasy Name');
    expect(response.body.companies[0].id).toEqual(123987);
    expect(response.body.companies[0].logo).toEqual(null);
    expect(response.body.companies[0].banner).toEqual(null);
  });

  it('should return unauthorized when requested with unauthorized token', async () => {
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

    const response = await request(server).get('/v1/admin/companies').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'N??o autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).get('/v1/admin/companies').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'N??o autorizado',
    });
  });
});
