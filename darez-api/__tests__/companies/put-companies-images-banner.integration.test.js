const request = require('supertest');
const mysql = require('mysql2');
const Jimp = require('jimp');
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
      promise: jest.fn(() => ({ key: 'banner_key' })),
    })),
    deleteObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  },
}));

jest.mock('jimp', () => ({
  read: jest.fn(),
}));

const mockWrite = jest.fn();
const mockQuality = jest.fn(() => ({ write: mockWrite }));
const mockScaleToFit = jest.fn(() => ({ quality: mockQuality }));

describe('PUT /v1/companies/images/banner', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '11';
  const phoneNumber = '912345679';
  const buffer = Buffer.from('Some data');

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

  it('should update a company banner without resizing', async () => {
    const mockSave = Jimp.read.mockImplementation(() => ({
      bitmap: {
        height: 10,
        width: 10,
      },
    }));

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

    const [[infoBefore]] = await connection.promise().query('SELECT banner FROM companies WHERE id=54321');

    const response = await request(server).put('/v1/companies/images/banner')
      .set('Authorization', login.body.access_token)
      .attach('file', buffer, 'custom_file_name.txt');

    const [[infoAfter]] = await connection.promise().query('SELECT banner FROM companies WHERE id=54321');

    expect(response.status).toEqual(204);
    expect(infoBefore.banner).toEqual(null);
    expect(infoAfter.banner).toEqual('banner_key');
    expect(Jimp.read).toHaveBeenCalledTimes(1);
    expect(mockWrite).toHaveBeenCalledTimes(0);
    expect(mockQuality).toHaveBeenCalledTimes(0);
    expect(mockWrite).toHaveBeenCalledTimes(0);

    mockSave.mockRestore();
  });

  it('should update a company banner after resizing', async () => {
    const mockSave = Jimp.read.mockImplementation(() => ({
      bitmap: {
        height: 301,
        width: 1281,
      },
      scaleToFit: mockScaleToFit,
    }));

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

    const [[infoBefore]] = await connection.promise().query('SELECT banner FROM companies WHERE id=54321');

    const response = await request(server).put('/v1/companies/images/banner')
      .set('Authorization', login.body.access_token)
      .attach('file', buffer, 'custom_file_name.txt');

    const [[infoAfter]] = await connection.promise().query('SELECT banner FROM companies WHERE id=54321');

    expect(response.status).toEqual(204);
    expect(infoBefore.banner).toEqual(null);
    expect(infoAfter.banner).toEqual('banner_key');
    expect(Jimp.read).toHaveBeenCalledTimes(1);
    expect(mockWrite).toHaveBeenCalledTimes(1);
    expect(mockQuality).toHaveBeenCalledTimes(1);
    expect(mockWrite).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/companies/images/banner').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
