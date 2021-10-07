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

describe('GET /v1/companies/:ID/payments', () => {
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

  it('should return an empty array of methods when the company does not exists or has no method', async () => {
    const response = await request(server).get('/v1/companies/9999912/payments').send();

    expect(response.status).toEqual(200);
    expect(response.body.methods).toEqual([]);
  });

  it('should return all company payment methods available', async () => {
    const response = await request(server).get('/v1/companies/123987/payments').send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      methods: [
        {
          name: 'Cartão',
          online: 1,
          has_change: 0,
        },
        {
          name: 'Crédito',
          online: 0,
          has_change: 0,
        },
        {
          name: 'Débito',
          online: 0,
          has_change: 0,
        },
        {
          name: 'Dinheiro',
          online: 0,
          has_change: 1,
        },
      ],
    });
  });
});
