const { deleteAddresses } = require('../deleteAddresses');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    UserAddresses: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: users/deleteAddresses', () => {
  it('when I use deleteAddresses should return success code', async () => {
    const response = await deleteAddresses({ body: { addresses: [1] }, userId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: { },
    });
  });

  it('when I use deleteAddresses with some error should return a status of error', async () => {
    const mockSaveUser = database.UserAddresses.update.mockImplementation(() => { throw new Error('Some error'); });

    const response = await deleteAddresses({ body: { addresses: [1] }, userId: 1 });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSaveUser.mockRestore();
  });
});
