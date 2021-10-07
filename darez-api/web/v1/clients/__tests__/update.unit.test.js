const { update } = require('../update');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyClients: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: clients/update', () => {
  it('when I use update should update a client', async () => {
    const mockSave = database.CompanyClients.update.mockImplementation(() => (0));

    const response = await update({
      body: { email: 'client@email.com' },
      params: { ID: 1 },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 204,
      data: { },
    });

    mockSave.mockRestore();
  });

  it('when I use update with some error should return error status', async () => {
    const mockSave = database.CompanyClients.update.mockImplementation(() => { throw new Error('Some error'); });

    const response = await update({
      body: { email: 'client@email.com' },
      params: { ID: 1 },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
