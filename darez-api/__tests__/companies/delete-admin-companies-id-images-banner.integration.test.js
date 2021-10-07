const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const { s3Client } = require('../../infrastructure/adapters/aws');

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
      promise: jest.fn(() => ({ key: 'logo_key' })),
    })),
    deleteObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  },
}));

describe('DELETE /v1/admin/companies/:ID/images/banner', () => {
  let server;
  let connection;
  const newPhoneCountryCode = '55';
  const newPhoneAreaCode = '11';
  const newPhoneNumber = '912345679';
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
        (12345, ${newPhoneCountryCode}, ${newPhoneAreaCode}, ${newPhoneNumber}, '123456', '2020-10-11 00:01:00', 'Full Name',
        ${defaultGroup.id})`);
    await connection.promise().query(`INSERT INTO companies
      (id, user_id, document, fantasy_name, cep, street, street_number, neighborhood, 
        city, state, latitude, longitude, phone_country_code, phone_area_code, phone_number, endpoint,
        banner, logo)
      VALUES
        (54321, 12345, '12345678900', 'Fantasy Name', '01234090', 'Street', '123', 'Neighborhood',
          'Sao Paulo', 'SP', '3.000003', '4.000004', '55', '11', '912345678', 'endpoint',
          'banner_key', 'logo_key')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM companies WHERE id=54321');
    await connection.promise().query('DELETE FROM user_login');
    await connection.promise().query('DELETE FROM users WHERE id=12345');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should return status 204 for a company that does not has banner', async () => {
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

    const [[infoBefore]] = await connection.promise().query('SELECT banner, logo FROM companies WHERE id=123987');

    const response = await request(server).delete('/v1/admin/companies/123987/images/banner')
      .set('Authorization', login.body.access_token).send();

    const [[infoAfter]] = await connection.promise().query('SELECT banner, logo FROM companies WHERE id=123987');

    expect(response.status).toEqual(204);
    expect(infoBefore.banner).toEqual(null);
    expect(infoAfter.banner).toEqual(null);
    expect(infoBefore.logo).toEqual(null);
    expect(infoAfter.logo).toEqual(null);
    expect(s3Client.deleteObject).not.toBeCalled();
  });

  it('should delete a banner from a company that has a banner when admin user', async () => {
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

    const [[infoBefore]] = await connection.promise().query('SELECT banner, logo FROM companies WHERE id=54321');

    const response = await request(server).delete('/v1/admin/companies/54321/images/banner')
      .set('Authorization', login.body.access_token).send();

    const [[infoAfter]] = await connection.promise().query('SELECT banner, logo FROM companies WHERE id=54321');

    expect(response.status).toEqual(204);
    expect(infoBefore.banner).toEqual('banner_key');
    expect(infoAfter.banner).toEqual(null);
    expect(infoBefore.logo).toEqual('logo_key');
    expect(infoAfter.logo).toEqual('logo_key');
    expect(s3Client.deleteObject).toHaveBeenCalledTimes(1);
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

    const response = await request(server).delete('/v1/admin/companies/54321/images/banner')
      .set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).delete('/v1/admin/companies/54321/images/banner').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
