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

jest.mock('../../infrastructure/adapters/aws', () => ({
  s3Client: {
    upload: jest.fn(() => ({
      promise: jest.fn(() => ({ key: 'banner_key' })),
    })),
    deleteObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  },
}));

describe('PUT /v1/promotions', () => {
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
        (123456, 123987, 0.10, 1, '2020-10-01 00:00:00', '2021-10-01 00:00:00')`);
    await connection.promise().query(`INSERT INTO products
        (id, company_id, name, description, price, category, subcategory, sort_id)
        VALUES
          (11111, 54321, 'product_promotion', 'some description', '10.00', 'CategoryTwo', 'SubCategoryTwo', 1)`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM products WHERE id=11111');
    await connection.promise().query('DELETE FROM promotions WHERE id=123456');
    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update a promotion', async () => {
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

    const [[infoBefore]] = await connection.promise().query('SELECT discount, has_limit_date FROM promotions WHERE id=123456');
    const [[infoProductBefore]] = await connection.promise().query('SELECT promotion, promotion_price FROM products WHERE id=11111');

    const response = await request(server).put('/v1/promotions/123456')
      .set('Authorization', login.body.access_token).send({
        discount: 0.12,
        has_limit_date: false,
        products: {
          add: [{ id: 11111, promotion_price: 8.80 }],
          delete: [],
        },
      });

    const [[infoAfter]] = await connection.promise().query('SELECT discount, has_limit_date FROM promotions WHERE id=123456');
    const [[infoProductAfter]] = await connection.promise().query('SELECT promotion, promotion_price FROM products WHERE id=11111');

    expect(response.status).toEqual(204);
    expect(infoBefore.discount).toEqual('0.1000');
    expect(infoBefore.has_limit_date).toEqual(1);
    expect(infoProductBefore.promotion).toEqual(null);
    expect(infoProductBefore.promotion_price).toEqual(null);
    expect(infoAfter.discount).toEqual('0.1200');
    expect(infoAfter.has_limit_date).toEqual(0);
    expect(infoProductAfter.promotion).toEqual(123456);
    expect(infoProductAfter.promotion_price).toEqual('8.80');
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

    const response = await request(server).put('/v1/promotions/123456')
      .set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/promotions/123456').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
