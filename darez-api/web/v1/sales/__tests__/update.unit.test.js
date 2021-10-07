const { update } = require('../update');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanySales: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('Unit Test: sales/update', () => {
  it('when I use update should update a sale', async () => {
    const mockSave = database.CompanySales.update.mockImplementation(() => (0));

    const response = await update({
      body: { description: 'description' },
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
    const mockSave = database.CompanySales.update.mockImplementation(() => { throw new Error('Some error'); });

    const response = await update({
      body: { description: 'description' },
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
