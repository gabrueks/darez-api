const { findProductsSubcategory } = require('../findProductsSubcategory');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Product: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: products/findProductsSubcategory', () => {
  it('when I call findProductsSubcategory should count products from each subcategory from a company', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [
      { category: 'category1', subcategory: 'subcategory1', countProducts: 1 },
      { category: 'category2', subcategory: 'subcategory2', countProducts: 2 },
    ]);
    const response = await findProductsSubcategory({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { category1: { subcategory1: 1 }, category2: { subcategory2: 2 } },
    });

    mockSave.mockRestore();
  });

  it('when I call findProductsSubcategory with some error should return a status of error', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await findProductsSubcategory({ params: { ID: 1 } });
    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
