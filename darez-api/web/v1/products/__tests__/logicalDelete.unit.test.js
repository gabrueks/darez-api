const { logicalDelete } = require('../logicalDelete');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Product: {
      update: jest.fn(),
    },
    ProductVariation: {
      update: jest.fn(),
    },
    ProductPhoto: {
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

describe('Unit Test: products/logicalDelete', () => {
  it('when I call logicalDelete should delete a product logically', async () => {
    const response = await logicalDelete({
      body: { products_ids_list: [1, 2] },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });

  it('when I call logicalDelete with some error should return a status of error', async () => {
    const mockSave = database.Product.update.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await logicalDelete({
      body: { products_ids_list: [1, 2] },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
