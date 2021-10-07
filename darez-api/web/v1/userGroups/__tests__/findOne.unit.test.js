const { findOne } = require('../findOne');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    UserGroup: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: User Group', () => {
  it('when I call findOne should return all info about a group', async () => {
    const mockSave = database.UserGroup.findOne.mockImplementation(() => ({
      id: 1, name: 'Group Name', permission1: 1, permission2: 0,
    }));

    const response = await findOne({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        id: 1, name: 'Group Name', permission1: 1, permission2: 0,
      },
    });

    mockSave.mockRestore();
  });

  it('when I call findOne some error should respond an error', async () => {
    const mockSave = database.UserGroup.findOne.mockImplementation(() => { throw new Error('Some Error'); });

    const response = await findOne({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
