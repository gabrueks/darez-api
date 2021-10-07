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

describe('PUT /v1/sales/:id', () => {
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

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should update a company sale', async () => {
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

    const [dbCheckSaleBefore] = await connection.promise().query('SELECT id, description, price, sale_method FROM company_sales WHERE id=1111');

    const response = await request(server).put('/v1/sales/1111').set('Authorization', login.body.access_token)
      .send({
        description: 'DESCRICAO',
        price: '200.00',
        sale_method: 'Crédito',
        date: '10/10/2010',
        time: '10:10',
      });

    const [dbCheckSaleAfter] = await connection.promise().query('SELECT id, description, price, sale_method FROM company_sales WHERE id=1111');

    await connection.promise().query(`UPDATE company_sales SET
      description = '${dbCheckSaleBefore[0].description}',
      price = ${dbCheckSaleBefore[0].price},
      sale_method = '${dbCheckSaleBefore[0].sale_method.toString()}'
      WHERE id=1111`);

    expect(response.status).toEqual(204);
    expect(dbCheckSaleBefore[0].description).toEqual('description');
    expect(dbCheckSaleBefore[0].price).toEqual('10.00');
    expect(dbCheckSaleBefore[0].sale_method).toEqual('Dinheiro');
    expect(dbCheckSaleAfter[0].description).toEqual('DESCRICAO');
    expect(dbCheckSaleAfter[0].price).toEqual('200.00');
    expect(dbCheckSaleAfter[0].sale_method).toEqual('Crédito');
  });

  it('should return status of bad request when invalid field is sent', async () => {
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

    const response = await request(server).put('/v1/sales/1010').set('Authorization', login.body.access_token).send({
      invalid_field: true,
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
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

    const response = await request(server).put('/v1/sales/1010').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).put('/v1/sales/1010').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
