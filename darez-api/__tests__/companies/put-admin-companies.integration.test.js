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

describe('PUT /v1/admin/companies/:ID', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';
  const userPhoneCountryCode = '55';
  const userPhoneAreaCode = '99';
  const userPhoneNumber = '987654329';
  const adminPhoneCountryCode = '55';
  const adminPhoneAreaCode = '99';
  const adminPhoneNumber = '987654387';

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
    await connection.promise().query(`INSERT INTO business_hours
      (company_id, monday_open, monday_close, wednesday_open, wednesday_close)
      VALUES
        (54321, '09:12', '14:00', '12:00', '18:30')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM business_hours WHERE company_id=54321');
    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update a company info when admin user', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const [[infoBefore]] = await connection.promise().query('SELECT fantasy_name, delivery_range, endpoint FROM companies WHERE id=54321');

    const response = await request(server).put('/v1/admin/companies/54321').set('Authorization', login.body.access_token).send({
      fantasy_name: 'New Fantasy Name',
      delivery_range: 10,
    });

    const [[infoAfter]] = await connection.promise().query('SELECT fantasy_name, delivery_range, endpoint FROM companies WHERE id=54321');

    expect(response.status).toEqual(204);
    expect(infoBefore.fantasy_name).toEqual('Fantasy Name');
    expect(infoBefore.delivery_range).toEqual(5);
    expect(infoBefore.endpoint).toEqual('endpoint');
    expect(infoAfter.fantasy_name).toEqual('New Fantasy Name');
    expect(infoAfter.delivery_range).toEqual(10);
    expect(infoAfter.endpoint).toEqual('endpoint');
  });

  it('should update a company address when admin user', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const [[infoBefore]] = await connection.promise().query('SELECT cep, state, city, street, street_number, neighborhood, latitude, longitude FROM companies WHERE id=54321');

    const response = await request(server).put('/v1/admin/companies/54321').set('Authorization', login.body.access_token).send({
      cep: '09876513',
      state: 'RJ',
      city: 'Rio de Janeiro',
      street: 'Rua dos Biscoitos',
      street_number: 7,
      neighborhood: 'Ipanema',
    });

    const [[infoAfter]] = await connection.promise().query('SELECT cep, state, city, street, street_number, neighborhood, latitude, longitude FROM companies WHERE id=54321');

    expect(response.status).toEqual(204);

    expect(infoBefore.cep).toEqual('01234090');
    expect(infoBefore.state).toEqual('SP');
    expect(infoBefore.city).toEqual('Sao Paulo');
    expect(infoBefore.street).toEqual('Street');
    expect(infoBefore.street_number).toEqual(123);
    expect(infoBefore.neighborhood).toEqual('Neighborhood');
    expect(infoBefore.latitude).toEqual(3.000003);
    expect(infoBefore.longitude).toEqual(4.000004);

    expect(infoAfter.cep).toEqual('09876513');
    expect(infoAfter.state).toEqual('RJ');
    expect(infoAfter.city).toEqual('Rio de Janeiro');
    expect(infoAfter.street).toEqual('Rua dos Biscoitos');
    expect(infoAfter.street_number).toEqual(7);
    expect(infoAfter.neighborhood).toEqual('Ipanema');
    expect(infoAfter.latitude).toEqual(1);
    expect(infoAfter.longitude).toEqual(2);
  });

  it('should update a company business hour when admin user', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const [[infoBefore]] = await connection.promise().query(`
      SELECT
        monday_open, monday_close, thusday_open, thusday_close, wednesday_open, wednesday_close
      FROM business_hours WHERE company_id=54321`);

    const response = await request(server).put('/v1/admin/companies/54321').set('Authorization', login.body.access_token).send({
      schedule: [
        { day: 2, open_time: '02:00', close_time: '13:45' },
        { day: 3, open_time: '12:00', close_time: '18:30' },
      ],
    });

    const [[infoAfter]] = await connection.promise().query(`
    SELECT
      monday_open, monday_close, thusday_open, thusday_close, wednesday_open, wednesday_close
    FROM business_hours WHERE company_id=54321`);

    expect(response.status).toEqual(204);

    expect(infoBefore.monday_open).toEqual('09:12:00');
    expect(infoBefore.monday_close).toEqual('14:00:00');
    expect(infoBefore.thusday_open).toEqual(null);
    expect(infoBefore.thusday_close).toEqual(null);
    expect(infoBefore.wednesday_open).toEqual('12:00:00');
    expect(infoBefore.wednesday_close).toEqual('18:30:00');

    expect(infoAfter.monday_open).toEqual(null);
    expect(infoAfter.monday_close).toEqual(null);
    expect(infoAfter.thusday_open).toEqual('02:00:00');
    expect(infoAfter.thusday_close).toEqual('13:45:00');
    expect(infoAfter.wednesday_open).toEqual('12:00:00');
    expect(infoAfter.wednesday_close).toEqual('18:30:00');
  });

  it('should return status of bad request when missing argument', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: adminPhoneCountryCode,
      phone_area_code: adminPhoneAreaCode,
      phone_number: adminPhoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).put('/v1/admin/companies/54321').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return unauthorized when requested with unauthorized token', async () => {
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

    const response = await request(server).put('/v1/admin/companies/123987').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/admin/companies/54321').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
