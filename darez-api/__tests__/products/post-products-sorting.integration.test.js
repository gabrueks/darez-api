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

describe('POST /v1/products/sorting', () => {
  let server;
  let connection;
  const companyPhoneCountryCode = '55';
  const companyPhoneAreaCode = '99';
  const companyPhoneNumber = '987984329';
  const userPhoneCountryCode = '55';
  const userPhoneAreaCode = '99';
  const userPhoneNumber = '987654329';

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
      (id, company_id, name, price, category, subcategory, sort_id)
      VALUES
        (12345, 123987, 'name1', 10.00, 'Category Three', 'Sub Category Three', 2),
        (12346, 123987, 'name2', 20.00, 'Category Three', 'Others', 3),
        (12347, 123987, 'name3', 30.00, 'Category Three', 'Others', 4)`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM products WHERE id IN (12345, 12346, 12347)');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update a product sort id when new is bigger than old', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const [[infoProd1Before]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12345');
    const [[infoProd2Before]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12346');
    const [[infoProd3Before]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12347');

    const response = await request(server).post('/v1/products/sorting').set('Authorization', login.body.access_token).send({
      id: 12345,
      old_sort_id: 2,
      new_sort_id: 4,
    });

    const [[infoProd1After]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12345');
    const [[infoProd2After]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12346');
    const [[infoProd3After]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12347');

    expect(response.status).toEqual(204);

    expect(infoProd1Before.id).toEqual(12345);
    expect(infoProd1Before.sort_id).toEqual(2);
    expect(infoProd2Before.id).toEqual(12346);
    expect(infoProd2Before.sort_id).toEqual(3);
    expect(infoProd3Before.id).toEqual(12347);
    expect(infoProd3Before.sort_id).toEqual(4);

    expect(infoProd1After.id).toEqual(12345);
    expect(infoProd1After.sort_id).toEqual(4);
    expect(infoProd2After.id).toEqual(12346);
    expect(infoProd2After.sort_id).toEqual(2);
    expect(infoProd3After.id).toEqual(12347);
    expect(infoProd3After.sort_id).toEqual(3);
  });

  it('should update a product sort id when old is bigger than new', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const [[infoProd1Before]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12345');
    const [[infoProd2Before]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12346');
    const [[infoProd3Before]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12347');

    const response = await request(server).post('/v1/products/sorting').set('Authorization', login.body.access_token).send({
      id: 12347,
      old_sort_id: 4,
      new_sort_id: 2,
    });

    const [[infoProd1After]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12345');
    const [[infoProd2After]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12346');
    const [[infoProd3After]] = await connection.promise().query('SELECT id, sort_id FROM products WHERE id=12347');

    expect(response.status).toEqual(204);

    expect(infoProd1Before.id).toEqual(12345);
    expect(infoProd1Before.sort_id).toEqual(2);
    expect(infoProd2Before.id).toEqual(12346);
    expect(infoProd2Before.sort_id).toEqual(3);
    expect(infoProd3Before.id).toEqual(12347);
    expect(infoProd3Before.sort_id).toEqual(4);

    expect(infoProd1After.id).toEqual(12345);
    expect(infoProd1After.sort_id).toEqual(3);
    expect(infoProd2After.id).toEqual(12346);
    expect(infoProd2After.sort_id).toEqual(4);
    expect(infoProd3After.id).toEqual(12347);
    expect(infoProd3After.sort_id).toEqual(2);
  });

  it('should return status of bad request when missing argument', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: companyPhoneCountryCode,
      phone_area_code: companyPhoneAreaCode,
      phone_number: companyPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).post('/v1/products/sorting').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when requested with unathorized token', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: userPhoneCountryCode,
      phone_area_code: userPhoneAreaCode,
      phone_number: userPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: userPhoneCountryCode,
      phone_area_code: userPhoneAreaCode,
      phone_number: userPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).post('/v1/products/sorting').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).post('/v1/products/sorting').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
