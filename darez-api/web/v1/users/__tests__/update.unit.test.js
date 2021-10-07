const { update } = require('../update');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    User: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: users/update', () => {
  it('when I use update with params should update a user', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const response = await update({
      params: { ID: '1' },
      body: { full_name: 'Full name', phone_area_code: '12' },
      userId: undefined,
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I use update without params should update a user', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const response = await update({
      userId: 2,
      params: { ID: undefined },
      body: { full_name: 'Full name', phone_area_code: '12' },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I use update with some error should return a status of error', async () => {
    const mockSave = database.User.update.mockImplementation(() => { throw new Error('Some error'); });

    const response = await update({
      params: { ID: '1' },
      body: { full_name: 'Full name', phone_area_code: '12' },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I use update with params should update a user\'s document', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const response = await update({
      params: { ID: '1124' },
      body: { document: '98439871015' },
      userId: undefined,
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });
});
