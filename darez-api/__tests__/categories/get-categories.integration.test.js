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

describe('GET /v1/categories', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345678';

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
    await connection.promise().query(`INSERT INTO users
      (id, phone_country_code, phone_area_code, phone_number, confirmation_code,
        confirmation_code_requested_at, full_name, document)
    VALUES
      (12345, ${phoneCountryCode}, ${phoneAreaCode}, ${phoneNumber}, '123456',
        '2020-10-11 00:01:00', 'Full Name', '12345678955')`);
    await connection.promise().query(`INSERT INTO companies
        (id, user_id, document, fantasy_name, cep, street, street_number, neighborhood, 
          city, state, latitude, longitude, phone_country_code, phone_area_code, phone_number)
      VALUES
        (54321, 12345, '12345678900', 'Fantasy Name', '01234090', 'Street', '123', 'Neighborhood',
        'Sao Paulo', 'SP', '1.000001', '2.000002', '55', '11', '912345678')`);
    await connection.promise().query(`INSERT INTO products
        (id, company_id, name, price, category, subcategory)
      VALUES
        (91823, 54321, 'Product Name', 100, 'CategoryTwo', 'Others')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM products WHERE company_id=54321');
    await connection.promise().query('DELETE FROM companies WHERE user_id=12345');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should return all active categories', async () => {
    const response = await request(server).get('/v1/categories').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('bucket_url');
    expect(response.body).toHaveProperty('categories');
  });

  it('should return all active categories from a region', async () => {
    const response = await request(server).get('/v1/categories?lat=1.000001&lng=2.000002').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('bucket_url');
    expect(response.body).toHaveProperty('categories');
    expect(response.body.categories).toEqual([{
      name: 'CategoryTwo', icon: 'icon/2', banner: 'banner2',
    }]);
  });

  it('should return an empty array when there is no available category in region', async () => {
    const response = await request(server).get('/v1/categories?lat=100.000001&lng=200.000002').send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('bucket_url');
    expect(response.body).toHaveProperty('categories');
    expect(response.body.categories).toEqual([]);
  });
});
