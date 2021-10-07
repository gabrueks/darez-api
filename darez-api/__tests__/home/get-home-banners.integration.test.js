const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const homeDefaultBanner = require('../../web/v1/helpers/strings/homeDefaultBanner');

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

describe('GET /home/banners', () => {
  let server;
  let connection;

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

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should return the default home banner when no location is given', async () => {
    const response = await request(server).get('/v1/home/banners').send();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      {
        banners: [
          {
            banner_url_high_res: homeDefaultBanner.HOME_DEFAULT_BANNER_RIGH_RES,
            banner_url_low_res: homeDefaultBanner.HOME_DEFAULT_BANNER_LOW_RES,
          },
        ],
        bucket_url: 'bucketUrl',
      },
    );
  });

  it('should return the banner for a given locale in range', async () => {
    const response = await request(server).get('/v1/home/banners')
      .query({
        lat: '1.008',
        lng: '2.008',
      }).send();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      banners: [
        {
          banner_url_high_res: 'high_res_banner',
          banner_url_low_res: 'low_resbanner',
          main_banner: true,
          distance: 1.257705498831692,
        },
      ],
      bucket_url: 'bucketUrl',
    });
  });

  it('should return the banner for a given locale out of range', async () => {
    const response = await request(server).get('/v1/home/banners')
      .query({
        lat: '1.008',
        lng: '2.008',
        range: '1.0',
      }).send();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      {
        banners: [
          {
            banner_url_high_res: homeDefaultBanner.HOME_DEFAULT_BANNER_RIGH_RES,
            banner_url_low_res: homeDefaultBanner.HOME_DEFAULT_BANNER_LOW_RES,
          },
        ],
        bucket_url: 'bucketUrl',
      },
    );
  });
});
