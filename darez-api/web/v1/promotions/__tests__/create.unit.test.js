const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Product: {
      update: jest.fn(),
    },
    Promotion: {
      create: jest.fn(),
    },
    Company: {
      findOne: jest.fn(() => ({ User: { confirmation_code: 123456, full_name: 'Full Name' } })),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: { create: jest.fn() },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const reqBodyDate = {
  discount: 1,
  has_limit_date: 1,
  date_start: '00/00/0000',
  date_end: '00/00/0000',
  products: [{
    id: 1,
    promotion_price: 90,
  }],
};

const reqBodyNoDate = {
  discount: 1,
  has_limit_date: 0,
  products: [{
    id: 1,
    promotion_price: 90,
  }],
};

describe('Unit Test: promotions/create', () => {
  it('when I call create with has_limit_date should create a new promotion with limit date', async () => {
    const mockSave = database.Promotion.create.mockImplementation(() => (
      { id: 1 }));
    const response = await create({ body: { ...reqBodyDate }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 201,
      data: { promotion_id: 1 },
    });
    mockSave.mockRestore();
  });

  it('when I call create without has_limit_date should create a new promotion with no limit date', async () => {
    const mockSave = database.Promotion.create.mockImplementation(() => (
      { id: 1 }));
    const response = await create({ body: { ...reqBodyNoDate }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 201,
      data: { promotion_id: 1 },
    });
    mockSave.mockRestore();
  });

  it('when I call create with some error should return a status of error', async () => {
    const mockSave = database.Promotion.create.mockImplementation(() => { throw new Error('Some error'); });
    const response = await create({ body: { ...reqBodyDate }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
