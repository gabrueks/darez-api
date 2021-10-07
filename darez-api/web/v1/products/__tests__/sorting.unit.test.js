const { sorting } = require('../sorting');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Sequelize: {
      literal: jest.fn(() => ({})),
    },
    Product: {
      update: jest.fn(),
      findAll: jest.fn(),
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

const reqBodySort = {
  id: 1,
  old_sort_id: 1,
  new_sort_id: 2,
};

describe('Unit Test: products/sorting', () => {
  it('when I call sorting it should change the product sort position', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [1, 2, 3]);
    const response = await sorting({
      body: { ...reqBodySort },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call sorting with some error should return a status of error', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await sorting({});

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
