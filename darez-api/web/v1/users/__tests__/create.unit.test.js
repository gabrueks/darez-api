const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    User: {
      findOrCreate: jest.fn(),
      update: jest.fn(),
    },
    UserGroup: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: users/create', () => {
  it('when I call create to add a new user then should reuse user and return his data with created true', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => [{}, true]);
    const mockUserGroupSave = database.UserGroup.findOne.mockImplementation(() => ({ id: 1 }));

    const response = await create({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '912345678',
        type: 'SMS',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });

    mockSave.mockRestore();
    mockUserGroupSave.mockRestore();
  });

  it('when I call create to validate user code then should reuse user and return his data with created true', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => [{}, false]);
    const mockUserGroupSave = database.UserGroup.findOne.mockImplementation(() => ({ id: 1 }));

    const response = await create({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        type: 'SMS',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
    mockUserGroupSave.mockRestore();
  });

  it('when I call create with some error should return a status of error', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => { throw new Error('Some error'); });
    const mockUserGroupSave = database.UserGroup.findOne.mockImplementation(() => ({ id: 1 }));

    const response = await create({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        type: 'SMS',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
    mockUserGroupSave.mockRestore();
  });

  it('when I call create with some error occurs in finding user group should return a status of error', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => [{}, false]);
    const mockUserGroupSave = database.UserGroup.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await create({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        type: 'SMS',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
    mockUserGroupSave.mockRestore();
  });
});
