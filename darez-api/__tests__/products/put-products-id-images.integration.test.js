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
      promise: jest.fn(() => ({ key: 'product_key' })),
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

describe('PUT /v1/products/:ID/images', () => {
  let server;
  let connection;
  const companyPhoneCountryCode = '55';
  const companyPhoneAreaCode = '99';
  const companyPhoneNumber = '987984329';
  const userPhoneCountryCode = '55';
  const userPhoneAreaCode = '99';
  const userPhoneNumber = '987654329';
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
    await connection.promise().query(`INSERT INTO products
      (id, company_id, name, price, category, subcategory, sort_id)
      VALUES
        (12345, 123987, 'name1', 10.00, 'Category Three', 'Sub Category Three', 2),
        (12346, 123987, 'name2', 20.00, 'Category Three', 'Others', 3)`);
    await connection.promise().query(`INSERT INTO product_photos
      (id, product_id, photo_key, is_main, thumbnail)
      VALUES
        (12345, 12345, 'photoKey1', 1, 'thumbnail1'),
        (12346, 12345, 'photoKey2', 0, 'thumbnail2')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM product_photos WHERE product_id IN (12345, 12346)');
    await connection.promise().query('DELETE FROM products WHERE id IN (12345, 12346)');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should upload a photo to a product that already has photos without resizing', async () => {
    const mockSave = Jimp.read.mockImplementation(() => ({
      bitmap: {
        height: 10,
        width: 10,
      },
    }));

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

    const [infoBefore] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12345');

    const response = await request(server).put('/v1/products/12345/images')
      .set('Authorization', login.body.access_token)
      .attach('files', buffer, 'custom_file_name.txt');

    const [infoAfter] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12345');

    expect(response.status).toEqual(204);
    expect(Jimp.read).toHaveBeenCalledTimes(2);
    expect(mockWrite).not.toBeCalled();
    expect(mockQuality).not.toBeCalled();
    expect(mockWrite).not.toBeCalled();

    expect(infoBefore.length).toEqual(2);
    expect(infoAfter.length).toEqual(3);

    mockSave.mockRestore();
  });

  it('should upload a photo to a product that already has photos and resize it', async () => {
    const mockSave = Jimp.read.mockImplementation(() => ({
      bitmap: {
        height: 300,
        width: 300,
      },
      scaleToFit: mockScaleToFit,
    }));

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

    const [infoBefore] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12345');

    const response = await request(server).put('/v1/products/12345/images')
      .set('Authorization', login.body.access_token)
      .attach('files', buffer, 'custom_file_name.txt');

    const [infoAfter] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12345');

    expect(response.status).toEqual(204);
    expect(Jimp.read).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledTimes(2);
    expect(mockQuality).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledTimes(2);

    expect(infoBefore.length).toEqual(2);
    expect(infoAfter.length).toEqual(3);

    mockSave.mockRestore();
  });

  it('should upload a photo to a product that does not have photos and resize it', async () => {
    const mockSave = Jimp.read.mockImplementation(() => ({
      bitmap: {
        height: 300,
        width: 300,
      },
      scaleToFit: mockScaleToFit,
    }));

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

    const [infoBefore] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12346');

    const response = await request(server).put('/v1/products/12346/images')
      .set('Authorization', login.body.access_token)
      .attach('files', buffer, 'custom_file_name.txt');

    const [infoAfter] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12346');

    expect(response.status).toEqual(204);
    expect(Jimp.read).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledTimes(2);
    expect(mockQuality).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledTimes(2);

    expect(infoBefore.length).toEqual(0);
    expect(infoAfter.length).toEqual(1);

    mockSave.mockRestore();
  });

  it('should upload a photo to a product that does not have photos and resize it', async () => {
    const mockSave = Jimp.read.mockImplementation(() => ({
      bitmap: {
        height: 300,
        width: 300,
      },
      scaleToFit: mockScaleToFit,
    }));

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

    const [infoBefore] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12346');

    const response = await request(server).put('/v1/products/12346/images')
      .set('Authorization', login.body.access_token)
      .attach('files', buffer, 'custom_file_name.txt');

    const [infoAfter] = await connection.promise().query('SELECT id, product_id, photo_key, is_main, thumbnail FROM product_photos WHERE product_id=12346');

    expect(response.status).toEqual(204);
    expect(Jimp.read).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledTimes(2);
    expect(mockQuality).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledTimes(2);

    expect(infoBefore.length).toEqual(0);
    expect(infoAfter.length).toEqual(1);

    mockSave.mockRestore();
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

    const response = await request(server).put('/v1/products/12345/images').set('Authorization', login.body.access_token)
      .attach('file', buffer, 'custom_file_name.txt');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when request without token', async () => {
    const response = await request(server).put('/v1/products/12345/images')
      .attach('file', buffer, 'custom_file_name.txt');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
