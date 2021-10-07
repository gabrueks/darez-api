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

const mockSearcResponse = {
  latitude: '1.000001',
  longitude: '2.000002',
  id: 123987,
  user_id: 987652,
  document: '12345609877',
  fantasy_name: 'Company Fantasy Name',
  phone_country_code: '55',
  phone_area_code: '99',
  phone_number: '987984329',
  cep: '01234090',
  street: 'Street',
  street_number: '123',
  neighborhood: 'Neighborhood',
  city: 'Sao Paulo',
  state: 'SP',
  endpoint: 'endpointunique',
};

jest.mock('../../infrastructure/adapters/algolia', () => ({
  client: {
    initIndex: jest.fn(() => ({
      setSettings: jest.fn(),
      saveObjects: jest.fn(),
      search: jest.fn(() => ({
        hits: [mockSearcResponse],
      })),
      clearObjects: jest.fn(),
    })),
  },
}));

describe('GET /v1/search/companies/:search', () => {
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

  it('Should return all companies', async () => {
    const response = await request(server).post('/v1/search/companies/Company Fantasy Name').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('companies');
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies).toContainEqual(mockSearcResponse);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return status of bad request when missing argument', async () => {
    const response = await request(server).post('/v1/search/companies/Company Fantasy Name').send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });
});
