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

describe('GET /v1/companies/:ID', () => {
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

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should return bad request when asked a company that does not exists', async () => {
    const response = await request(server).get('/v1/companies/9999912').send();

    expect(response.status).toEqual(400);
  });

  it('should return some company info', async () => {
    const response = await request(server).get('/v1/companies/123987').send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      fantasy_name: 'Company Fantasy Name',
      cep: '01234090',
      street: 'Street',
      street_number: 123,
      address_2: null,
      neighborhood: 'Neighborhood',
      city: 'Sao Paulo',
      state: 'SP',
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987984329',
      banner: 'banner2',
      logo: null,
      delivery_range: 5,
      latitude: 1.000001,
      longitude: 2.000002,
      endpoint: 'endpointunique',
      bucket_url: 'bucketUrl',
    });
  });
});
