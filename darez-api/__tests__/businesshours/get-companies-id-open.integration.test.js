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

describe('GET /companies/:ID/open', () => {
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

  it('should return true when store is open at datetime', async () => {
<<<<<<< HEAD
    const openDT = '2021-01-04T14:32:22.556Z';
    const response = await request(server).get('/v1/companies/123987/open').query({ DATETIME: openDT }).send();
=======
    const DATETIME = '2021-01-04T16:32:22.556Z';
    const response = await request(server).get('/v1/companies/123987/open').query({ DATETIME }).send();
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
    expect(response.body).toEqual({ shop_open: true });
    expect(response.status).toEqual(200);
  });

  it('should return false when store is not open at datetime', async () => {
<<<<<<< HEAD
    const closedDT = '2021-01-04T20:32:22.556Z';
    const response = await request(server).get('/v1/companies/123987/open').query({ DATETIME: closedDT }).send();
=======
    const DATETIME = '2021-01-04T20:32:22.556Z';
    const response = await request(server).get('/v1/companies/123987/open').query({ DATETIME }).send();
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
    expect(response.body).toEqual({ shop_open: false });
    expect(response.status).toEqual(200);
  });

  it('should return true if store has no datetime', async () => {
<<<<<<< HEAD
    const closedDT = '2021-01-04T23:59:22.556Z';
    // There is no company with ID 707070, so there should be no businessHour entry
    const response = await request(server).get('/v1/companies/707070/open').query({ DATETIME: closedDT }).send();
=======
    const DATETIME = '2021-01-04T23:59:22.556Z';
    // There is no company with ID 707070, so there should be no businessHour entry
    const response = await request(server).get('/v1/companies/707070/open').query({ DATETIME }).send();
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
    expect(response.body).toEqual({ shop_open: true });
    expect(response.status).toEqual(200);
  });
});
