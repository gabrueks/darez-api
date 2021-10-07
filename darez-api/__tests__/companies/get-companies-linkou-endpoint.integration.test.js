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

describe('GET /v1/companies/linkou/:endpoint', () => {
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

  it('should get a company info by its endpoint', async () => {
    const response = await request(server).get('/v1/companies/linkou/endpointunique').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('bucket_url');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('banner');
    expect(response.body).toHaveProperty('facebook_url');
    expect(response.body).toHaveProperty('instagram_url');
    expect(response.body).toHaveProperty('endpoint');
    expect(response.body).toHaveProperty('fantasy_name');
    expect(response.body).toHaveProperty('logo');
    expect(response.body).toHaveProperty('phone_number');
    expect(response.body).toHaveProperty('phone_area_code');
    expect(response.body).toHaveProperty('phone_country_code');
  });
});
