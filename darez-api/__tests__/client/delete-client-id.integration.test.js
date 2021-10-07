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

jest.mock('../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('DELETE /v1/clients/:id', () => {
  let server;
  let connection;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987984329';

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
    await connection.promise().query(`INSERT INTO company_clients
        (id, company_id, name, phone_country_code, phone_area_code, phone_number, email)
        VALUES
        (12356, 123987, 'Client Name', '55', '11', '912345678', 'email@mail.com')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM company_clients WHERE id=12356');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should delete a company client', async () => {
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

    const [[dbCheckClientBefore]] = await connection.promise().query('SELECT id, active FROM company_clients WHERE id=12356');

    const response = await request(server).delete('/v1/clients/12356').set('Authorization', login.body.access_token).send();

    const [[dbCheckClientAfter]] = await connection.promise().query('SELECT id, active FROM company_clients WHERE id=12356');

    expect(response.status).toEqual(200);
    expect(dbCheckClientBefore.active).toBeTruthy();
    expect(dbCheckClientAfter.active).toBeFalsy();
  });

  it('should return unauthorized when requested with unauthorized token', async () => {
    await request(server).post('/v1/users').send({
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987654329',
      type: 'WTS',
      is_consultant: true,
    });

    const login = await request(server).post('/v1/login').send({
      phone_country_code: '55',
      phone_area_code: '99',
      phone_number: '987654329',
      confirmation_code: '289732',
      is_consultant: true,
    });

    const response = await request(server).delete('/v1/clients/12356').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).delete('/v1/clients/12356').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
