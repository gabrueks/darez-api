const { logicalDelete } = require('../logicalDelete');
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

describe('Unit Test: promotions/logicalDelete', () => {
  it('when I call logicalDelete should delete a promotion logically', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [{ id: 1 }]);
    const response = await logicalDelete({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call logicalDelete with some error should return a status of error', async () => {
    const mockSaveFindAll = database.Product.findAll.mockImplementation(() => [{ id: 1 }]);
    const mockSave = database.Promotion.update.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await logicalDelete({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
    mockSaveFindAll.mockRestore();
  });
});
