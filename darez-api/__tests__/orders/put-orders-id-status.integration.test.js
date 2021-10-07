const request = require('supertest');
const mysql = require('mysql2');
const axios = require('axios');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const { unauthorized, orderStatusString } = require('../../web/v1/helpers');

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

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
}));

describe('PUT /orders/:ID/status', () => {
  let server;
  let connection;
  let login;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987654387'; // User from group 2
  const seedOrderId = 'id-do-pedido';
  const testData = {
    user_id: 987653,
    order_id: 'id-do-novo-pedido',
    company_id: 123987,
    asaas_id: 'asaas_id',
    address: {
      cep: '01016040',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Sé',
      street: 'Largo Pátio do Colégio',
      street_number: 2,
      address_2: '',
    },
    payment_method: 'Dinheiro',
    total_price: 25.15,
    status: 'Solicitado',
  };

  beforeAll(async () => {
    server = await app();
    connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      port: DB_PORT,
    });
    await request(server).post('/v1/users').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      type: 'WTS',
      is_consultant: true,
    });

    login = await request(server).post('/v1/login').send({
      phone_country_code: phoneCountryCode,
      phone_area_code: phoneAreaCode,
      phone_number: phoneNumber,
      confirmation_code: '289732',
      is_consultant: true,
    });
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.promise().query('DELETE FROM user_login');
    await connection.end();
  });

  it('shoud return unauthorized if no valid token is sent', async () => {
    const response = await request(server).put(`/v1/orders/${seedOrderId}/status`).send({
      status: orderStatusString.DELIVERED,
    });
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: unauthorized });
  });

  it('shoud return bad request if a order status doesnt follow the schema', async () => {
    const response = await request(server).put(`/v1/orders/${seedOrderId}/status`)
      .set('Authorization', login.body.access_token)
      .send({ status: 'pago' });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: '"status" with value "pago" fails to match the required pattern: /^Confirmado$|^Entregue$|^Cancelado$/' });
  });

  it('should update a specific order status', async () => {
    await connection.promise().query(`INSERT INTO orders
    (id, company_id, buyer, cep, street, street_number,
      neighborhood, city, state, price, payment_method,
      status, active)
  VALUES
    ('${testData.order_id}',${testData.company_id},${testData.user_id},'${testData.address.cep}',
    '${testData.address.street}',${testData.address.street_number},'${testData.address.neighborhood}',
    '${testData.address.city}','${testData.address.state}',${testData.total_price},'${testData.payment_method}',
    '${testData.status}',1);`);

    const response = await request(server).put(`/v1/orders/${testData.order_id}/status`)
      .set('Authorization', login.body.access_token)
      .send({
        status: orderStatusString.CONFIRMED,
      });

    const [[dbOrder]] = await connection.promise().query(
      `SELECT 
          id, company_id, buyer, cep, street,
          street_number, neighborhood, city, state,
          price, payment_method, status, active 
          FROM darezdb.orders
          where id='${testData.order_id}';
      `,
    );
    await connection.promise().query(`DELETE FROM orders WHERE id='${testData.order_id}'`);

    expect(response.status).toEqual(204);
    expect(response.body).toEqual({});
    expect(dbOrder.status).toEqual(orderStatusString.CONFIRMED);
  });

  it('should execute a cashback when new status is canceled and order has an asaas_id', async () => {
    await connection.promise().query(`INSERT INTO orders
    (id, company_id, buyer, cep, street, street_number,
      neighborhood, city, state, price, payment_method,
      status, active, asaas_id)
  VALUES
    ('${testData.order_id}',${testData.company_id},${testData.user_id},'${testData.address.cep}',
    '${testData.address.street}',${testData.address.street_number},'${testData.address.neighborhood}',
    '${testData.address.city}','${testData.address.state}',${testData.total_price},'${testData.payment_method}',
    '${testData.status}',1,'${testData.asaas_id}');`);

    const mockSaveAxios = axios.post.mockImplementation(() => ({ data: { status: 'REFUNDED' } }));

    const response = await request(server).put(`/v1/orders/${testData.order_id}/status`)
      .set('Authorization', login.body.access_token)
      .send({
        status: orderStatusString.CANCELLED,
      });

    mockSaveAxios.mockRestore();

    const [[dbOrder]] = await connection.promise().query(
      `SELECT 
          id, company_id, buyer, cep, street,
          street_number, neighborhood, city, state,
          price, payment_method, status, active, asaas_status 
          FROM darezdb.orders
          where id='${testData.order_id}';
      `,
    );
    await connection.promise().query(`DELETE FROM orders WHERE id='${testData.order_id}'`);

    expect(response.status).toEqual(204);
    expect(response.body).toEqual({});
    expect(dbOrder.status).toEqual(orderStatusString.CANCELLED);
    expect(dbOrder.asaas_status).toEqual('REFUNDED');
  });
});
