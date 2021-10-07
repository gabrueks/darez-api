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

describe('DELETE /v1/promotions/schedule', () => {
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
    await connection.promise().query(`INSERT INTO promotions
        (id, company_id, discount, has_limit_date, date_start, date_end)
        VALUES
        (123456, 123987, 0.1, true, '2020-10-11 00:01:00', '2020-12-11 00:01:00')`);
    await connection.promise().query(`INSERT INTO products
        (id, company_id, name, description, price, category, subcategory, sort_id, promotion, promotion_price)
        VALUES
        (11111, 123987, 'product_pomotion', 'some description', '10.00', 'CategoryTwo', 'SubCategoryTwo', 1, 123456, '9.00')`);
  });

  afterEach(async () => {
    await connection.promise().query('DELETE FROM products WHERE id=11111');
    await connection.promise().query('DELETE FROM promotions WHERE id=123456');
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
    await connection.end();
  });

  it('should delete all dated promotions', async () => {
    const [[dbCheckProductBefore]] = await connection.promise().query('SELECT promotion, promotion_price FROM products WHERE id=11111');
    const [[dbCheckPromotionBefore]] = await connection.promise().query('SELECT * FROM promotions WHERE id=123456');

    expect(dbCheckProductBefore.promotion).toEqual(123456);
    expect(dbCheckProductBefore.promotion_price).toEqual('9.00');
    expect(dbCheckPromotionBefore.active).toEqual(1);

    const response = await request(server).delete('/v1/promotions/schedule').send();

    expect(response.status).toEqual(204);

    const [[dbCheckProductAfter]] = await connection.promise().query('SELECT promotion, promotion_price FROM products WHERE id=11111');
    const [[dbCheckPromotionAfter]] = await connection.promise().query('SELECT * FROM promotions WHERE id=123456');

    expect(dbCheckProductAfter.promotion).toEqual(null);
    expect(dbCheckProductAfter.promotion_price).toEqual(null);
    expect(dbCheckPromotionAfter.active).toEqual(0);
  });
});
