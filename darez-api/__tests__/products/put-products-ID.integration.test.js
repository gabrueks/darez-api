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

describe('PUT /v1/products', () => {
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

  beforeEach(async () => {
    await connection.promise().query(`INSERT INTO products
        (id, company_id, name, description, price, category, subcategory, sort_id)
        VALUES
        (12345678, 123987, 'Product', 'Some description', 10, 'CategoryTwo', 'SubCategoryTwo', 1)`);
    await connection.promise().query(`INSERT INTO product_variations
        (id, product_id, color, size)
        VALUES
        (321, 12345678, 'red', 'G')`);
    await connection.promise().query(`INSERT INTO product_photos
        (id, product_id, photo_key, is_main)
        VALUES
        (123, 12345678, 'photo key1', 1), (124, 12345678, 'photo key2', 0)`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM product_photos WHERE product_id=12345678');
    await connection.promise().query('DELETE FROM product_variations WHERE product_id=12345678');
    await connection.promise().query('DELETE FROM products WHERE id=12345678');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update a product info', async () => {
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

    const [[infoProductBefore]] = await connection.promise().query('SELECT name, description, price FROM products WHERE id=12345678');

    const response = await request(server).put('/v1/products/12345678').set('Authorization', login.body.access_token).send({
      name: 'New Name',
      description: 'New Description',
      price: 100.00,
    });

    const [[infoProductAfter]] = await connection.promise().query('SELECT name, description, price FROM products WHERE id=12345678');

    expect(response.status).toEqual(204);
    expect(infoProductBefore.name).toEqual('Product');
    expect(infoProductBefore.description).toEqual('Some description');
    expect(infoProductBefore.price).toEqual('10.00');

    expect(infoProductAfter.name).toEqual('New Name');
    expect(infoProductAfter.description).toEqual('New Description');
    expect(infoProductAfter.price).toEqual('100.00');
  });

  it('should update a product variation', async () => {
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

    const [[infoVariationBefore]] = await connection.promise().query('SELECT id, color, size FROM product_variations WHERE product_id=12345678');

    const response = await request(server).put('/v1/products/12345678').set('Authorization', login.body.access_token).send({
      variations: [
        {
          id: 321,
          color: 'blue',
          size: 'P',
        },
      ],
    });

    const [[infoVariationAfter]] = await connection.promise().query('SELECT id, color, size FROM product_variations WHERE product_id=12345678');

    expect(response.status).toEqual(204);
    expect(infoVariationBefore.color).toEqual('red');
    expect(infoVariationBefore.size).toEqual('G');

    expect(infoVariationAfter.color).toEqual('blue');
    expect(infoVariationAfter.size).toEqual('P');
  });

  it('should update a product main photo', async () => {
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

    const [[infoPhotoBefore]] = await connection.promise().query('SELECT is_main FROM product_photos WHERE product_id=12345678');

    const response = await request(server).put('/v1/products/12345678').set('Authorization', login.body.access_token).send({
      main_image: 124,
    });

    const [[infoPhotoAfter]] = await connection.promise().query('SELECT is_main FROM product_photos WHERE product_id=12345678');

    expect(response.status).toEqual(204);
    expect(infoPhotoBefore.is_main).toEqual(1);

    expect(infoPhotoAfter.is_main).toEqual(0);
  });

  it('should return status of bad request when missing argument', async () => {
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

    const response = await request(server).put('/v1/products/12345678').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/products/12345678').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
