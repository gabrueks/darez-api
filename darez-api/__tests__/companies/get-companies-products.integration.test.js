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

describe('GET /v1/companies/products', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987984329';

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

  it('should get all company products infos when loged in as company', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).get('/v1/companies/products').query({ token: login.body.access_token }).send();

    expect(response.status).toEqual(200);
    expect(response.body.products.length).toEqual(1);
    expect(response.body.products[0].id).toEqual(123987);
    expect(response.body.products[0].company_id).toEqual(123987);
    expect(response.body.products[0].name).toEqual('Product Name');
    expect(response.body.products[0].description).toEqual('Some description');
    expect(response.body.products[0].price).toEqual('12.99');
    expect(response.body.products[0].category).toEqual('CategoryTwo');
    expect(response.body.products[0].subcategory).toEqual('SubCategoryTwo');
    expect(response.body.products[0].sort_id).toEqual(1);
    expect(response.body.products[0].photo_key).toEqual('thumbnail1');
    expect(response.body.products[0].promotion_id).toEqual(null);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should get all company products infos when not loged in', async () => {
    const response = await request(server).get('/v1/companies/products').query({ ID: 123987 }).send();

    expect(response.status).toEqual(200);
    expect(response.body.products.length).toEqual(1);
    expect(response.body.products[0].id).toEqual(123987);
    expect(response.body.products[0].company_id).toEqual(123987);
    expect(response.body.products[0].name).toEqual('Product Name');
    expect(response.body.products[0].description).toEqual('Some description');
    expect(response.body.products[0].price).toEqual('12.99');
    expect(response.body.products[0].category).toEqual('CategoryTwo');
    expect(response.body.products[0].subcategory).toEqual('SubCategoryTwo');
    expect(response.body.products[0].sort_id).toEqual(1);
    expect(response.body.products[0].photo_key).toEqual('thumbnail1');
    expect(response.body.products[0].promotion_id).toEqual(null);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return bad request when does not send query params', async () => {
    const response = await request(server).get('/v1/companies/products').send();

    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual('Inv??lido');
  });
});
