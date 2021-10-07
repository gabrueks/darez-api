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

describe('GET /v1/products', () => {
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

  beforeEach(async () => {
    await connection.promise().query(`INSERT INTO products
        (id, company_id, name, description, price, category, subcategory, sort_id)
        VALUES
        (12345678, 123987, 'Product', 'Some description', 10, 'CategoryTwo', 'SubCategoryTwo', 1)`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM products WHERE id=12345678');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should get a info', async () => {
    const response = await request(server).get('/v1/products/12345678').send();

    const [[infoProductAfter]] = await connection.promise().query('SELECT * FROM products WHERE id=12345678');

    expect(response.status).toEqual(200);
    expect(infoProductAfter.active).toEqual(1);
    expect(infoProductAfter.name).toEqual('Product');
    expect(infoProductAfter.description).toEqual('Some description');
    expect(infoProductAfter.price).toEqual('10.00');
    expect(infoProductAfter.category).toEqual('CategoryTwo');
    expect(infoProductAfter.subcategory).toEqual('SubCategoryTwo');
  });
});
