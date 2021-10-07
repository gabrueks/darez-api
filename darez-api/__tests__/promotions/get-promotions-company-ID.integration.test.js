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

describe('GET /v1/promotions/company', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';

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
    const [[defaultGroup]] = await connection.promise().query(`SELECT
        id FROM user_groups WHERE name='company_owner'`);
    await connection.promise().query(`INSERT INTO users
        (id, phone_country_code, phone_area_code, phone_number, confirmation_code,
          confirmation_code_requested_at, full_name, user_group)
      VALUES
        (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456', '2020-10-11 00:01:00', 'Full Name',
        ${defaultGroup.id})`);
    await connection.promise().query(`INSERT INTO companies
      (id, user_id, document, fantasy_name, cep, street, street_number, neighborhood,
        city, state, latitude, longitude, phone_country_code, phone_area_code, phone_number, endpoint)
      VALUES
        (54321, 12345, '12345678900', 'Fantasy Name', '01234090', 'Street', '123', 'Neighborhood',
          'Sao Paulo', 'SP', '3.000003', '4.000004', '55', '11', '912345678', 'endpoint')`);
    await connection.promise().query(`INSERT INTO promotions
      (id, company_id, discount, has_limit_date, date_start, date_end)
      VALUES
        (123457, 123987, 0.12, 0, '2020-10-01 00:00:00', '2030-10-01T00:00:00.000Z')`);
    await connection.promise().query(`INSERT INTO promotions
      (id, company_id, discount, has_limit_date, date_start, date_end)
      VALUES
        (123456, 123987, 0.10, 1, '2020-10-01 00:00:00', '2021-10-01 00:00:00')`);
    await connection.promise().query(`INSERT INTO products
      (id, company_id, name, description, price, category, subcategory, sort_id, promotion, promotion_price)
      VALUES
        (123099, 123987, 'Product', 'Some description', 10, 'CategoryTwo', 'SubCategoryTwo', 1, 123457, 8.80)`);
    await connection.promise().query(`INSERT INTO products
      (id, company_id, name, description, price, category, subcategory, sort_id, promotion, promotion_price)
      VALUES
        (123098, 123987, 'Product', 'Some description', 10, 'CategoryTwo', 'SubCategoryTwo', 1, 123456, 9.00)`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM products WHERE id=123099');
    await connection.promise().query('DELETE FROM products WHERE id=123098');
    await connection.promise().query('DELETE FROM promotions WHERE id=123456');
    await connection.promise().query('DELETE FROM promotions WHERE id=123457');
    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should get promotions info from company', async () => {
    const response = await request(server).get('/v1/promotions/company/123987').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('promotion');

    expect(response.body.promotion[1].id).toEqual(123457);
    expect(response.body.promotion[1].company_id).toEqual(123987);
    expect(response.body.promotion[1].discount).toEqual('0.1200');
    expect(response.body.promotion[1].has_limit_date).toEqual(false);
    expect(response.body.promotion[1].date_start).toEqual('2020-10-01T00:00:00.000Z');
    expect(response.body.promotion[1].date_end).toEqual('2030-10-01T00:00:00.000Z');
    expect(response.body.promotion[1]).toHaveProperty('products');

    expect(response.body.promotion[0].products[0].category).toEqual('CategoryTwo');
    expect(response.body.promotion[0].products[0].created_by).toEqual(null);
    expect(response.body.promotion[0].products[0].description).toEqual('Some description');
    expect(response.body.promotion[0].products[0].id).toEqual(123098);
    expect(response.body.promotion[0].products[0].name).toEqual('Product');
    expect(response.body.promotion[0].products[0].photo_key).toEqual([]);
    expect(response.body.promotion[0].products[0].price).toEqual('10.00');
    expect(response.body.promotion[0].products[0].promotion_price).toEqual('9.00');
    expect(response.body.promotion[0].products[0].subcategory).toEqual('SubCategoryTwo');

    expect(response.body.promotion[0].id).toEqual(123456);
    expect(response.body.promotion[0].company_id).toEqual(123987);
    expect(response.body.promotion[0].discount).toEqual('0.1000');
    expect(response.body.promotion[0].has_limit_date).toEqual(true);
    expect(response.body.promotion[0].date_start).toEqual('2020-10-01T00:00:00.000Z');
    expect(response.body.promotion[0].date_end).toEqual('2021-10-01T00:00:00.000Z');
    expect(response.body.promotion[0]).toHaveProperty('products');

    expect(response.body.promotion[1].products[0].category).toEqual('CategoryTwo');
    expect(response.body.promotion[1].products[0].created_by).toEqual(null);
    expect(response.body.promotion[1].products[0].description).toEqual('Some description');
    expect(response.body.promotion[1].products[0].id).toEqual(123099);
    expect(response.body.promotion[1].products[0].name).toEqual('Product');
    expect(response.body.promotion[1].products[0].photo_key).toEqual([]);
    expect(response.body.promotion[1].products[0].price).toEqual('10.00');
    expect(response.body.promotion[1].products[0].promotion_price).toEqual('8.80');
    expect(response.body.promotion[1].products[0].subcategory).toEqual('SubCategoryTwo');
  });
});
