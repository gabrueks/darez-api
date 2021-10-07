const request = require('supertest');
const mysql = require('mysql2');
const app = require('../../application');
const sequelize = require('../../infrastructure/database/models');
const { unauthorized } = require('../../web/v1/helpers');

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

describe('POST /orders', () => {
  let server;
  let connection;
  let login;
  const phoneCountryCode = '55';
  const phoneAreaCode = '99';
  const phoneNumber = '987654387'; // User from group 2

  const testData = {
    user_id: 987653,
    company_id: 123987,
    address_id: 7895,
    existing_address: {
      cep: '02462050',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Chora Menino',
      street: 'R. Jauari',
      street_number: 57,
      address_2: '',
    },
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
    product: {
      product_id: 123987,
      variation_id: 123988,
      unity_price: 25.15,
      quantity: 1,
    },
    product_variation: {
      id: 123988,
      product_id: 123987,
      color: 'red',
      size: 'M',
    },
    description: 'Some description',
    category: 'CategoryTwo',
    subcategory: 'SubCategoryTwo',
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
    const response = await request(server).post('/v1/orders').send();
    expect(response.status).toEqual(401);
    expect(response.body).toEqual({ message: unauthorized });
  });

  it('shoud return bad request if a order doesnt follow the schema', async () => {
    const response = await request(server).post('/v1/orders')
      .set('Authorization', login.body.access_token)
      .send({ invalid: 'order' });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ message: '"company_id" is required' });
  });

  it('should create a new order with the correct variations', async () => {
    const response = await request(server).post('/v1/orders')
      .set('Authorization', login.body.access_token)
      .send({
        company_id: testData.company_id,
        address_id: testData.address_id,
        payment_method: testData.payment_method,
        total_price: 25.15,
        products: [
          {
            product_id: testData.product.product_id,
            variation_id: testData.product.variation_id,
            unity_price: testData.product.unity_price,
            quantity: testData.product.quantity,
          },
        ],
      });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('order_id');
    const { order_id: orderId } = response.body;
    const [[dbOrder]] = await connection.promise().query(
      `SELECT 
        id, company_id, buyer, cep, street,
        street_number, neighborhood, city, state,
        price, payment_method, status, active 
        FROM darezdb.orders
        where id='${orderId}';
    `,
    );
    const [[dbOrderProduct]] = await connection.promise().query(
      `SELECT 
        id, order_id, product_id, product_variation_id,
        quantity, unity_price, company_id, name, description,
        category, subcategory, color, size 
        FROM darezdb.order_products
        where order_id='${orderId}';
    `,
    );
    await connection.promise().query(`DELETE FROM orders WHERE id='${orderId}'`);
    await connection.promise().query(`DELETE FROM order_products WHERE order_id='${orderId}'`);
    // Check if order was correctly completed
    expect(dbOrder).toMatchObject({
      id: orderId,
      buyer: testData.user_id,
      company_id: testData.company_id,
      cep: testData.existing_address.cep,
      price: testData.product.unity_price.toString(), // Only works as quantity = 1
      payment_method: testData.payment_method,
      status: 'Solicitado',
      active: 1,
    });

    // Check if the product was correctly ordered
    expect(dbOrderProduct).toMatchObject({
      order_id: orderId,
      product_id: testData.product.product_id,
      company_id: testData.company_id,
      product_variation_id: testData.product_variation.id,
      quantity: 1,
      unity_price: testData.product.unity_price.toString(),
      category: testData.category,
      subcategory: testData.subcategory,
      description: testData.description,
    });
  });

  // TODO: userAddress order creation - Manda endereco antigo e ve se usa o certo
  it('shoud create a new order with an existing address', async () => {
    const response = await request(server).post('/v1/orders')
      .set('Authorization', login.body.access_token)
      .send({
        company_id: testData.company_id,
        address_id: testData.address_id,
        payment_method: testData.payment_method,
        total_price: testData.total_price,
        products: [
          {
            product_id: testData.product.product_id,
            variation_id: null,
            unity_price: testData.product.unity_price,
            quantity: 1,
          },
        ],
      });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('order_id');
    const { order_id: orderId } = response.body;
    const [[dbOrder]] = await connection.promise().query(
      `SELECT 
        id, company_id, buyer, cep, street,
        street_number, neighborhood, city, state,
        price, payment_method, status, active 
        FROM darezdb.orders
        where id='${orderId}';
    `,
    );

    await connection.promise().query(`DELETE FROM orders WHERE id='${orderId}'`);
    await connection.promise().query(`DELETE FROM order_products WHERE order_id='${orderId}'`);

    expect(dbOrder).toMatchObject({
      id: orderId,
      company_id: testData.company_id,
      cep: testData.existing_address.cep,
      street: testData.existing_address.street,
      street_number: testData.existing_address.street_number,
      neighborhood: testData.existing_address.neighborhood,
      city: testData.existing_address.city,
      state: testData.existing_address.state,
    });
  });

  // TODO: userAddress - Manda novo endereco e ve se cria certo e usa o certo
  it('shoud create a new order with a new address', async () => {
    const response = await request(server).post('/v1/orders')
      .set('Authorization', login.body.access_token)
      .send({
        company_id: testData.company_id,
        address: testData.address,
        payment_method: testData.payment_method,
        total_price: testData.total_price,
        products: [
          testData.product,
        ],
      });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('order_id');
    const { order_id: orderId } = response.body;
    const [[dbOrder]] = await connection.promise().query(
      `SELECT 
        id, company_id, buyer, cep, street,
        street_number, neighborhood, city, state,
        price, payment_method, status, active 
        FROM darezdb.orders
        where id='${orderId}';
    `,
    );
    const [[dbAddress]] = await connection.promise().query(
      `SELECT
        user_id, cep, street, street_number, address_2,
        neighborhood, city, state
      FROM darezdb.user_addresses
      WHERE cep='${testData.address.cep}'
    `,
    );

    await connection.promise().query(`DELETE FROM orders WHERE id='${orderId}'`);
    await connection.promise().query(`DELETE FROM order_products WHERE order_id='${orderId}'`);
    await connection.promise().query(`DELETE FROM user_addresses WHERE cep='${testData.address.cep}'`);

    // Check if order was correctly completed
    expect(dbOrder).toMatchObject({
      id: orderId,
      company_id: testData.company_id,
      cep: testData.address.cep,
      price: testData.product.unity_price.toString(), // Only works as quantity = 1
      payment_method: testData.payment_method,
      status: 'Solicitado',
      active: 1,
    });

    // Check if address was correctly added
    expect(dbAddress).toMatchObject({
      user_id: testData.user_id,
      cep: testData.address.cep,
      street: testData.address.street,
      street_number: testData.address.street_number,
      address_2: '',
      neighborhood: testData.address.neighborhood,
      city: testData.address.city,
      state: testData.address.state,
    });
  });
});
