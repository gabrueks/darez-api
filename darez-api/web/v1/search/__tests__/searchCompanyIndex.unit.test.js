const { indexCompanies } = require('../searchCompanyIndex');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Company: {
      findAll: jest.fn(),
    },
  },
}));

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

describe('Unit Test: search/searchCompanyIndex', () => {
  it('When I call indexCompanies should return all companies info', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => ([{ id: 1 }, { id: 2 }]));
    const response = await indexCompanies();

    expect(response).toEqual({
      statusCode: 200,
      data: [{ objectID: 1, id: 1 }, { objectID: 2, id: 2 }],
    });

    mockSave.mockRestore();
  });

  it('When I call indexCompanies with some error should return a status of error', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const response = await indexCompanies();

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
