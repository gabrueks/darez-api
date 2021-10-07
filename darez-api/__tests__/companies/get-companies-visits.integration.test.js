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

describe('GET /v1/companies/visits', () => {
  let server;
  let connection;
  const userPhoneCountryCode = '55';
  const userPhoneAreaCode = '99';
  const userPhoneNumber = '987654329';
  const companyPhoneCountryCode = '55';
  const companyPhoneAreaCode = '99';
  const companyPhoneNumber = '987984329';

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

  it('should return an empty array when no visits occured', async () => {
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

    const response = await request(server).get('/v1/companies/visits').query({
      company_id: 123987, before: '2020-12-05 19:00:00', after: '2020-12-05 13:00:00',
    }).set('Authorization', login.body.access_token)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });

  it('should return how many visits a company has when company and time specified', async () => {
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

    const response = await request(server).get('/v1/companies/visits').query({
      company_id: 123987, before: '2020-12-01 19:00:00', after: '2020-12-01 13:00:00',
    }).set('Authorization', login.body.access_token)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].company_id).toEqual(123987);
    expect(response.body[0].visits).toEqual(1);
  });

  it('should return how many visits a company has when company specified', async () => {
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

    const response = await request(server).get('/v1/companies/visits').query({ company_id: 123987 }).set('Authorization', login.body.access_token)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].company_id).toEqual(123987);
    expect(response.body[0].visits).toEqual(2);
  });

  it('should return how many visits a company has when no filter applied', async () => {
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

    const response = await request(server).get('/v1/companies/visits').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].company_id).toEqual(123987);
    expect(response.body[0].visits).toEqual(2);
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

    const response = await request(server).get('/v1/companies/visits').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).get('/v1/companies/visits').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
