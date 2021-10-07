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

describe('GET /v1/companies/geo-distance', () => {
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

  it('should get all companies', async () => {
    const response = await request(server).get('/v1/companies/geo-distance').send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0]).toEqual({
      id: 123987,
      user_id: 987652,
      street: 'Street',
      street_number: 123,
      cep: '01234090',
      state: 'SP',
      city: 'Sao Paulo',
      fantasy_name: 'Company Fantasy Name',
      address_2: null,
      delivery_range: 5,
      phone_number: '987984329',
      phone_country_code: '55',
      phone_area_code: '99',
      latitude: 1.000001,
      longitude: 2.000002,
      endpoint: 'endpointunique',
      logo: null,
      banner: null,
      total_products: 1,
    });
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should get all companies from a lat && lng', async () => {
    const response = await request(server).get('/v1/companies/geo-distance')
      .query({
        lat: '1.000001',
        lng: '2.000002',
      })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0]).toEqual({
      id: 123987,
      user_id: 987652,
      street: 'Street',
      street_number: 123,
      cep: '01234090',
      state: 'SP',
      city: 'Sao Paulo',
      fantasy_name: 'Company Fantasy Name',
      address_2: null,
      delivery_range: 5,
      phone_number: '987984329',
      phone_country_code: '55',
      phone_area_code: '99',
      latitude: 1.000001,
      longitude: 2.000002,
      distance: 0,
      endpoint: 'endpointunique',
      logo: null,
      banner: null,
      total_products: 1,
    });
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should get all companies from a range limit', async () => {
    const response = await request(server).get('/v1/companies/geo-distance')
      .query({
        lat: '1.000001',
        lng: '2.000002',
        range: 10,
      })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(1);
    expect(response.body.companies[0]).toEqual({
      id: 123987,
      user_id: 987652,
      street: 'Street',
      street_number: 123,
      cep: '01234090',
      state: 'SP',
      city: 'Sao Paulo',
      fantasy_name: 'Company Fantasy Name',
      address_2: null,
      delivery_range: 5,
      phone_number: '987984329',
      phone_country_code: '55',
      phone_area_code: '99',
      latitude: 1.000001,
      longitude: 2.000002,
      distance: 0,
      total_products: 1,
      endpoint: 'endpointunique',
      logo: null,
      banner: null,
    });
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return empty when no companies available given a range', async () => {
    const response = await request(server).get('/v1/companies/geo-distance')
      .query({
        lat: '10',
        lng: '20',
        range: 5,
      })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(0);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return empty when no companies available', async () => {
    const response = await request(server).get('/v1/companies/geo-distance')
      .query({
        lat: '10',
        lng: '20',
      })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.companies.length).toEqual(0);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return invalid request when no lat OR lng send range is in query', async () => {
    const response = await request(server).get('/v1/companies/geo-distance')
      .query({
        range: 1,
      })
      .send();

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual('Inválido');
  });
});
