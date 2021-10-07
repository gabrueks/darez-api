process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { clearCompanies } = require('../searchCompanyClean');

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

describe('Unit Test: search/searchCompanyClean', () => {
  it('When I call clearCompanies should clear algolia cache', async () => {
    const response = await clearCompanies();

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });
});
