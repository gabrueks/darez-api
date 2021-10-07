const { findEndpoints } = require('../findEndpoints');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: companies/findEndpoints', () => {
  it('when I call findEndpoints should return all endpoints', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => ([{ endpoint: 'endpoint' }]));
    const response = await findEndpoints();

    expect(response).toEqual({
      statusCode: 200,
      data: [{ endpoint: 'endpoint' }],
    });
    mockSave.mockRestore();
  });

  it('when I call findEndpoints with some error should return a status of error', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const response = await findEndpoints();

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
