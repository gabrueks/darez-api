const { update } = require('../update');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Product: {
      update: jest.fn(),
      findAll: jest.fn(),
    },
    Promotion: {
      update: jest.fn(),
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

const reqBodyUpdateDate = {
  discount: 1,
  has_limit_date: 1,
  date_start: '00/00/0000',
  date_end: '00/00/0000',
  products: {
    add: [{
      id: 1,
      promotion_price: 90,
    }],
    delete: [],
  },
};

describe('Unit Test: promotions/update', () => {
  it('when I call update should update promotion and products', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [1]);
    const response = await update({ params: { ID: '1' }, body: { ...reqBodyUpdateDate }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call update without params ID should update a promotion using companyId', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [1]);
    const response = await update({ params: {}, body: { ...reqBodyUpdateDate }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call update with some error should return a status of error', async () => {
    const mockSave = database.Promotion.update.mockImplementation(() => { throw new Error('Some error'); });
    const response = await update({ params: { ID: '1' }, body: { ...reqBodyUpdateDate } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
