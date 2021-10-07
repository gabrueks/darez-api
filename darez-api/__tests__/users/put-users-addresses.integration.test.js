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

describe('PUT /v1/users/addresses', () => {
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
    await connection.promise().query(`INSERT INTO user_addresses
      (id, user_id, street, street_number, neighborhood, city, state, latitude, longitude, cep)
    VALUES
      (54321, 12345, 'Rua Quata', 300, 'Vila Olimpia', 'São Paulo',
        'SP', 3.000003, 4.000004, '01234567')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM user_addresses WHERE id=54321');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update an user address', async () => {
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

    const [[infoBefore]] = await connection.promise().query('SELECT * FROM user_addresses WHERE id=54321');

    const response = await request(server).put('/v1/users/addresses').set('Authorization', login.body.access_token).send({
      cep: '01234789',
      state: 'RJ',
      city: 'Rio de Janeiro',
      street: 'Rua Do Rio',
      street_number: 147,
      neighborhood: 'Bairro',
      id: 54321,
    });

    const [[infoAfter]] = await connection.promise().query('SELECT * FROM user_addresses WHERE id=54321');

    expect(response.status).toEqual(204);
    expect(infoBefore.cep).toEqual('01234567');
    expect(infoBefore.state).toEqual('SP');
    expect(infoBefore.city).toEqual('São Paulo');
    expect(infoBefore.street).toEqual('Rua Quata');
    expect(infoBefore.street_number).toEqual(300);
    expect(infoBefore.address_2).toEqual(null);
    expect(infoBefore.neighborhood).toEqual('Vila Olimpia');
    expect(infoBefore.latitude).toEqual(3.000003);
    expect(infoBefore.longitude).toEqual(4.000004);
    expect(infoAfter.latitude).toEqual(1);
    expect(infoAfter.longitude).toEqual(2);
    expect(infoAfter.cep).toEqual('01234789');
    expect(infoAfter.state).toEqual('RJ');
    expect(infoAfter.city).toEqual('Rio de Janeiro');
    expect(infoAfter.street).toEqual('Rua Do Rio');
    expect(infoAfter.street_number).toEqual(147);
    expect(infoAfter.address_2).toEqual(null);
    expect(infoAfter.neighborhood).toEqual('Bairro');
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

    const response = await request(server).put('/v1/users/addresses').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/users/addresses').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
