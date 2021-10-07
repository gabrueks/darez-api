const { deleteProdVariation } = require('../deleteProdVariation');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    ProductVariation: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: products/deleteProdVariation', () => {
  it('when I call deleteProdVariation should update a product variation and return success', async () => {
    const response = await deleteProdVariation({
      body: { product_variation: [1, 2] },
      params: { ID: '1' },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });

  it('when I call deleteProdVariation with some error should return a status of error', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await deleteProdVariation({
      body: { product_variation: [1, 2] },
      params: { ID: '1' },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
