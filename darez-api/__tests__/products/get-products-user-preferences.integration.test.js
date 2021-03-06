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

jest.mock('axios', () => ({
  create: jest.fn(),
  post: jest.fn(),
  default: {
    get: jest.fn(() => ({
      data: {
        recent: {
          catProd: {
            name: 'CategoryTwo',
            count: 20,
          },
          catPage: {
            name: 'CategoryTwo',
            count: 2,
          },
        },
        total: {
          catProd: {
            name: 'CategoryTwo',
            count: 30,
          },
          catPage: {
            name: 'CategoryTwo',
            count: 3,
          },
        },
      },
    })),
  },
}));

describe('GET /v1/products', () => {
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

  it('should get products by user preferences', async () => {
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
    const response = await request(server).get('/v1/products/user/preferences').set('Authorization', login.body.access_token).query({
      lat: 1, lng: 2,
    })
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('recent');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('bucket_url');

    expect(response.body.total.category_page.products[0].id).toEqual(123987);
    expect(response.body.total.category_page.products[0].name).toEqual('Product Name');
    expect(response.body.total.category_page.products[0].description).toEqual('Some description');
    expect(response.body.total.category_page.products[0].price).toEqual('12.99');
    expect(response.body.total.category_page.products[0].category).toEqual('CategoryTwo');
    expect(response.body.total.category_page.products[0].subcategory).toEqual('SubCategoryTwo');
    expect(response.body.total.category_page.products[0]).toHaveProperty('photo_key');

    expect(response.body.total.product_page.products[0].id).toEqual(123987);
    expect(response.body.total.product_page.products[0].name).toEqual('Product Name');
    expect(response.body.total.product_page.products[0].description).toEqual('Some description');
    expect(response.body.total.product_page.products[0].price).toEqual('12.99');
    expect(response.body.total.product_page.products[0].category).toEqual('CategoryTwo');
    expect(response.body.total.product_page.products[0].subcategory).toEqual('SubCategoryTwo');
    expect(response.body.total.product_page.products[0]).toHaveProperty('photo_key');

    expect(response.body.recent.category_page.products[0].id).toEqual(123987);
    expect(response.body.recent.category_page.products[0].name).toEqual('Product Name');
    expect(response.body.recent.category_page.products[0].description).toEqual('Some description');
    expect(response.body.recent.category_page.products[0].price).toEqual('12.99');
    expect(response.body.recent.category_page.products[0].category).toEqual('CategoryTwo');
    expect(response.body.recent.category_page.products[0].subcategory).toEqual('SubCategoryTwo');
    expect(response.body.recent.category_page.products[0]).toHaveProperty('photo_key');

    expect(response.body.recent.product_page.products[0].id).toEqual(123987);
    expect(response.body.recent.product_page.products[0].name).toEqual('Product Name');
    expect(response.body.recent.product_page.products[0].description).toEqual('Some description');
    expect(response.body.recent.product_page.products[0].price).toEqual('12.99');
    expect(response.body.recent.product_page.products[0].category).toEqual('CategoryTwo');
    expect(response.body.recent.product_page.products[0].subcategory).toEqual('SubCategoryTwo');
    expect(response.body.recent.product_page.products[0]).toHaveProperty('photo_key');
  });
});
