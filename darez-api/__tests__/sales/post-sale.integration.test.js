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

describe('POST /v1/sales', () => {
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

  it('should create a new company sale when split_times sent', async () => {
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

    const response = await request(server).post('/v1/sales').set('Authorization', login.body.access_token).send({
      description: 'description',
      price: '10.00',
      client_id: 1234,
      sale_method: 'Dinheiro',
      date: '10/10/2010',
      time: '10:10',
      split_times: 1,
    });

    const [dbCheckSales] = await connection.promise().query('SELECT id, description, price, client_id, sale_method FROM company_sales WHERE company_id=123987');
    await connection.promise().query(`DELETE FROM company_sales WHERE id=${dbCheckSales[1].id}`);

    expect(response.status).toEqual(201);
    expect(dbCheckSales[1].description).toEqual('description');
    expect(dbCheckSales[1].price).toEqual('10.00');
    expect(dbCheckSales[1].client_id).toEqual(1234);
    expect(dbCheckSales[1].sale_method).toEqual('Dinheiro');
  });

  it('should create a two new company sales when split_times equal 2', async () => {
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

    const response = await request(server).post('/v1/sales').set('Authorization', login.body.access_token).send({
      description: 'description',
      price: 10.00,
      client_id: 1234,
      sale_method: 'Crédito',
      date: '10/10/2010',
      time: '10:10',
      split_times: 2,
    });

    const [dbCheckSales] = await connection.promise().query('SELECT id, price, client_id, sale_method, split_times, split_number FROM company_sales WHERE company_id=123987');
    await connection.promise().query(`DELETE FROM company_sales WHERE id IN (${dbCheckSales[1].id}, ${dbCheckSales[2].id})`);

    expect(response.status).toEqual(201);

    expect(dbCheckSales[1].price).toEqual('5.00');
    expect(dbCheckSales[1].client_id).toEqual(1234);
    expect(dbCheckSales[1].sale_method).toEqual('Crédito');
    expect(dbCheckSales[1].split_times).toEqual(2);
    expect(dbCheckSales[1].split_number).toEqual(1);

    expect(dbCheckSales[2].price).toEqual('5.00');
    expect(dbCheckSales[2].client_id).toEqual(1234);
    expect(dbCheckSales[2].sale_method).toEqual('Crédito');
    expect(dbCheckSales[2].split_times).toEqual(2);
    expect(dbCheckSales[2].split_number).toEqual(2);
  });

  it('should create a new company sale when no split_times sent', async () => {
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

    const response = await request(server).post('/v1/sales').set('Authorization', login.body.access_token).send({
      description: 'description',
      price: '10.00',
      client_id: 1234,
      sale_method: 'Dinheiro',
      date: '10/10/2010',
      time: '10:10',
    });

    const [dbCheckSales] = await connection.promise().query('SELECT id, description, price, client_id, sale_method FROM company_sales WHERE company_id=123987');
    await connection.promise().query(`DELETE FROM company_sales WHERE id=${dbCheckSales[1].id}`);

    expect(response.status).toEqual(201);
    expect(dbCheckSales[1].description).toEqual('description');
    expect(dbCheckSales[1].price).toEqual('10.00');
    expect(dbCheckSales[1].client_id).toEqual(1234);
    expect(dbCheckSales[1].sale_method).toEqual('Dinheiro');
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

    const response = await request(server).post('/v1/sales').set('Authorization', login.body.access_token).send({
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

    const response = await request(server).post('/v1/sales').set('Authorization', login.body.access_token).send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });

  it('should return unauthorized when requested without token', async () => {
    const response = await request(server).post('/v1/sales').send();

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      message: 'Não autorizado',
    });
  });
});
