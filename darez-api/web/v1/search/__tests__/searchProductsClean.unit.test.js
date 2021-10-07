const { clearProducts } = require('../searchProductsClean');

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../../../../infrastructure/adapters/algolia', () => ({
  client: {
    initIndex: jest.fn(() => ({
      setSettings: jest.fn(),
      saveObjects: jest.fn(),
      search: jest.fn(() => ({ hits: [{ latitude: 1, longitude: 2 }] })),
      clearObjects: jest.fn(),
    })),
  },
}));

describe('Unit Test: search/searchProductsClean', () => {
  it('When I call clearProducts should clear algolia cache', async () => {
    const response = await clearProducts();

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });
});
