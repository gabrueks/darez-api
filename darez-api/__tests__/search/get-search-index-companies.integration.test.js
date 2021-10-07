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

jest.mock('../../infrastructure/adapters/algolia', () => ({
  client: {
    initIndex: jest.fn(() => ({
      setSettings: jest.fn(),
      saveObjects: jest.fn(),
      search: jest.fn(() => ({ hits: [{ latitude: 1.000001, longitude: 2.000002 }] })),
      clearObjects: jest.fn(),
    })),
  },
}));

describe('GET /v1/search/index/companies', () => {
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

  it('Should return all companies info', async () => {
    const response = await request(server).get('/v1/search/index/companies').send();

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0]).toHaveProperty('fantasy_name');
    expect(response.body[0]).toHaveProperty('latitude');
    expect(response.body[0]).toHaveProperty('longitude');
    expect(response.body[0]).toHaveProperty('logo');
    expect(response.body[0]).toHaveProperty('banner');
    expect(response.body[0]).toHaveProperty('objectID');
    expect(response.body[0]).toHaveProperty('total_products');
    expect(response.body[0]).toHaveProperty('active');
    expect(response.body[0]).toHaveProperty('neighborhood');
    expect(response.body[0]).toHaveProperty('street');
    expect(response.body[0]).toHaveProperty('state');
    expect(response.body[0]).toHaveProperty('street_number');
    expect(response.body[0]).toHaveProperty('city');
    expect(response.body[0]).toHaveProperty('delivery_range');
    expect(response.body[0]).toHaveProperty('endpoint');
    expect(response.body[0]).toHaveProperty('phone_country_code');
    expect(response.body[0]).toHaveProperty('phone_area_code');
    expect(response.body[0]).toHaveProperty('phone_number');
  });
});
