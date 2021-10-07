const { findProductVariations } = require('../findProductVariations');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    ProductVariation: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: products/findProductVariations', () => {
  it('when I call FindProductVariations show all active variations of a product', async () => {
    const mockSave = database.ProductVariation.findAll.mockImplementation(
      () => [{ color: 'b', size: '22' }],
    );
    const response = await findProductVariations({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 200,
      data: [{ color: 'b', size: '22' }],
    });
    mockSave.mockRestore();
  });

  it('when I call FindProductVariations with some error should return a status of error', async () => {
    const mockSave = database.ProductVariation.findAll.mockImplementation(
      () => {
        throw new Error('Some error');
      },
    );
    const response = await findProductVariations({ params: { ID: '1' } });
    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
