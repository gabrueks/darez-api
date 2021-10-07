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

describe('POST /v1/companies/visits', () => {
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

  it('should create a new visit to a company and revisit the same company', async () => {
    const responseCreate = await request(server).post('/v1/companies/visits')
      .set('ipv4', '200.200.100.100')
      .send({ companyId: 123987 });

    const responseRevisit = await request(server).post('/v1/companies/visits')
      .set('ipv4', '200.200.100.100')
      .send({ companyId: 123987 });

    const [[dbCheckVisit]] = await connection.promise().query('SELECT company_id, userIpv4 FROM company_visits WHERE userIpv4=\'200.200.100.100\' AND company_id=123987');
    await connection.promise().query('DELETE FROM company_visits WHERE userIpv4=\'200.200.100.100\' AND company_id=123987');

    expect(responseCreate.status).toEqual(201);
    expect(dbCheckVisit.company_id).toEqual(123987);
    expect(dbCheckVisit.userIpv4).toEqual('200.200.100.100');
    expect(responseRevisit.status).toEqual(204);
  });

  it('should return bad request when requested without company id', async () => {
    const response = await request(server).post('/v1/companies/visits').send();

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });
});
