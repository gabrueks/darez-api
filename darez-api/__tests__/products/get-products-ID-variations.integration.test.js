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

describe('GET /v1/products/ID/variations', () => {
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

  it('should get products variations', async () => {
    const response = await request(server).get('/v1/products/123987/variations').send();

    expect(response.status).toEqual(200);
    expect(response.body[0].id).toEqual(123987);
    expect(response.body[0].color).toEqual('red');
    expect(response.body[0].size).toEqual('P');

    expect(response.body[1].id).toEqual(123988);
    expect(response.body[1].color).toEqual('red');
    expect(response.body[1].size).toEqual('M');

    expect(response.body[2].id).toEqual(123989);
    expect(response.body[2].color).toEqual('blue');
    expect(response.body[2].size).toEqual('G');
  });
});
