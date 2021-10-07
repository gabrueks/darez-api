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

describe('DELETE /v1/products/ID/variations', () => {
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
        (product_id, id, color, size)
        VALUES
        (12345678, 123456, 'red', 'P')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM product_variations WHERE id=123456');
    await connection.promise().query('DELETE FROM products WHERE id=12345678');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should delete product variation', async () => {
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

    const [[infoVariationBefore]] = await connection.promise().query('SELECT active FROM product_variations WHERE id=123456');

    const response = await request(server).delete('/v1/products/12345678/variations').set('Authorization', login.body.access_token).send({
      product_variation: [123456],
    });

    const [[infoVariationAfter]] = await connection.promise().query('SELECT active FROM product_variations WHERE id=123456');

    expect(response.status).toEqual(204);
    expect(infoVariationBefore.active).toEqual(1);
    expect(infoVariationAfter.active).toEqual(0);
  });
});
