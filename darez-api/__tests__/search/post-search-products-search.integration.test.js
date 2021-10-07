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
  company_id: 123987,
  name: 'Product Name',
  description: 'Some description',
  price: 12.99,
  category: 'CategoryTwo',
  subcategory: 'SubCategoryTwo',
  photos: ['photo_key1', 'photo_key2'],
  fantasy_name: 'Company Fantasy Name',
  delivery_range: 5,
  latitude: 1.000001,
  longitude: 2.000002,
  objectId: 123987,
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

describe('GET /v1/search/products/:search', () => {
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

  it('Should return all products', async () => {
    const response = await request(server).post('/v1/search/products/Product Name').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('products');
    expect(response.body.products.length).toEqual(1);
    expect(response.body.products).toContainEqual(mockSearcResponse);
    expect(response.body.bucket_url).toEqual('bucketUrl');
  });

  it('should return status of bad request when missing argument', async () => {
    const response = await request(server).post('/v1/search/products/Product Name').send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });
});
