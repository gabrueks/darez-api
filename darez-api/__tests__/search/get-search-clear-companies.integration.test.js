const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const { mockClearObject } = require('../../infrastructure/adapters/algolia');

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

jest.mock('../../infrastructure/adapters/algolia', () => {
  // eslint-disable-next-line no-shadow
  const mockClearObject = jest.fn();
  return {
    client: {
      initIndex: jest.fn(() => ({
        setSettings: jest.fn(),
        saveObjects: jest.fn(),
        search: jest.fn(),
        clearObjects: mockClearObject,
      })),
    },
    mockClearObject,
  };
});

describe('GET /v1/search/clear/companies', () => {
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

  it('Should clear all companies indexed', async () => {
    const response = await request(server).get('/v1/search/clear/companies').send();

    expect(response.status).toEqual(204);
    expect(mockClearObject).toHaveBeenCalledTimes(1);
  });
});
