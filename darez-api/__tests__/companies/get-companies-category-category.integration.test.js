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

describe('GET /v1/companies/category/:category', () => {
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

  it('should get all companies that has product is some category', async () => {
    const response = await request(server).get('/v1/companies/category/CategoryTwo').send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0]).toEqual({
      id: 123987,
      user_id: 987652,
      fantasy_name: 'Company Fantasy Name',
      cep: '01234090',
      street: 'Street',
      street_number: 123,
      address_2: null,
      neighborhood: 'Neighborhood',
      city: 'Sao Paulo',
      state: 'SP',
      banner: null,
      logo: null,
      endpoint: 'endpointunique',
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987984329',
      count_products: 1,
    });
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should get all companies that has product is some category within some lat lng range', async () => {
    const response = await request(server).get('/v1/companies/category/CategoryTwo')
      .query({
        lat: '1.000001',
        lng: '2.000002',
      }).send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0]).toEqual({
      id: 123987,
      user_id: 987652,
      fantasy_name: 'Company Fantasy Name',
      cep: '01234090',
      street: 'Street',
      street_number: 123,
      address_2: null,
      neighborhood: 'Neighborhood',
      city: 'Sao Paulo',
      state: 'SP',
      banner: null,
      logo: null,
      endpoint: 'endpointunique',
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987984329',
      total_products: 1,
    });
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return empty when no companies with products in some category with lat && lng', async () => {
    const response = await request(server).get('/v1/companies/category/Serviços')
      .query({
        lat: '1.000001',
        lng: '2.000002',
      }).send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(0);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return empty when no companies with products in some category without lat && lng', async () => {
    const response = await request(server).get('/v1/companies/category/Serviços').send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(0);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });
});
