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

describe('GET /v1/users/company', () => {
  let server;
  let connection;
  const phoneCountryCode1 = '55';
  const phoneAreaCode1 = '11';
  const phoneNumber1 = '912345678';
  const phoneCountryCode2 = '55';
  const phoneAreaCode2 = '11';
  const phoneNumber2 = '912345679';

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
        confirmation_code_requested_at, full_name)
    VALUES
      (12345, ${phoneCountryCode1}, ${phoneAreaCode1}, ${phoneNumber1}, '123456', '2020-10-11 00:01:00', 'Full Name'),
      (12346, ${phoneCountryCode2}, ${phoneAreaCode2}, ${phoneNumber2}, '123456', '2020-10-11 00:01:00', 'Full Name')`);
    await connection.promise().query(`INSERT INTO companies
        (id, user_id, document, fantasy_name, cep, street, street_number, neighborhood, 
          city, state, latitude, longitude, phone_country_code, phone_area_code, phone_number)
      VALUES
        (54321, 12345, '12345678900', 'Fantasy Name', '01234090', 'Street', '123', 'Neighborhood',
        'Sao Paulo', 'SP', '1.000001', '2.000002', ${phoneCountryCode1}, ${phoneAreaCode1}, ${phoneNumber1})`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id IN (12345, 12346)');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should not return users company infos from a user that does not has a company', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode2,
      phone_area_code: phoneAreaCode2,
      phone_number: phoneNumber2,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode2,
      phone_area_code: phoneAreaCode2,
      phone_number: phoneNumber2,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).get('/v1/users/company').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('full_name');
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('company');
  });

  it('should return users company infos from a user that has a company', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode1,
      phone_area_code: phoneAreaCode1,
      phone_number: phoneNumber1,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode1,
      phone_area_code: phoneAreaCode1,
      phone_number: phoneNumber1,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).get('/v1/users/company').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('full_name');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('company');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).get('/v1/users/company').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
