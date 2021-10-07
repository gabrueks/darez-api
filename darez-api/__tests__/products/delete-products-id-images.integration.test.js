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

jest.mock('../../infrastructure/adapters/aws', () => ({
  s3Client: {
    upload: jest.fn(() => ({
      promise: jest.fn(() => ({ key: 'product_key' })),
    })),
    deleteObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  },
}));

describe('DELETE /v1/products/:ID/images', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';
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
        (12346, 123987, 'name2', 20.00, 'Category Three', 'Others', 3)`);
    await connection.promise().query(`INSERT INTO product_photos
      (id, product_id, photo_key, is_main, thumbnail)
      VALUES
        (12345, 12345, 'photoKey1', 1, 'thumbnail1'),
        (12346, 12345, 'photoKey2', 0, 'thumbnail2'),
        (12347, 12345, 'photoKey3', 0, 'thumbnail3')`);

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
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM product_photos WHERE product_id IN (12345, 12346)');
    await connection.promise().query('DELETE FROM products WHERE id IN (12345, 12346)');

    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should delete images of a product that has images', async () => {
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

    const [infoBefore] = await connection.promise().query('SELECT id FROM product_photos WHERE product_id=12345');

    const response = await request(server).delete('/v1/products/12345/images')
      .set('Authorization', login.body.access_token)
      .send({ image_id: [12345, 12346] });

    const [infoAfter] = await connection.promise().query('SELECT id FROM product_photos WHERE product_id=12345');

    expect(response.status).toEqual(204);

    expect(infoBefore.length).toEqual(3);
    expect(infoAfter.length).toEqual(1);
  });

  it('should do nothing if image does not exists', async () => {
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

    const [infoBefore] = await connection.promise().query('SELECT id FROM product_photos WHERE product_id=12345');

    const response = await request(server).delete('/v1/products/12345/images')
      .set('Authorization', login.body.access_token)
      .send({ image_id: [12344] });

    const [infoAfter] = await connection.promise().query('SELECT id FROM product_photos WHERE product_id=12345');

    expect(response.status).toEqual(204);

    expect(infoBefore.length).toEqual(3);
    expect(infoAfter.length).toEqual(3);
  });

  it('should return status of bad request if list of images is empty', async () => {
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

    const response = await request(server).delete('/v1/products/12345/images')
      .set('Authorization', login.body.access_token)
      .send({ image_id: [] });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
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

    const response = await request(server).delete('/v1/products/12345/images')
      .set('Authorization', login.body.access_token)
      .send({ invalid_field: true });

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

    const response = await request(server).delete('/v1/products/12345/images').set('Authorization', login.body.access_token)
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).delete('/v1/products/12345/images')
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
