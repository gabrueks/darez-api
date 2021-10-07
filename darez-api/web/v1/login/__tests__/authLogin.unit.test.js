const { authLogin } = require('../authLogin');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    User: {
      findOne: jest.fn(),
      update: jest.fn(),
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

describe('Unit Test: login/authLogin', () => {
  it('when I call authLogin should find a user and send him a login code', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({
      id: 1,
      confirmation_code_requested_at: '2020-12-16 16:44:35',
    }));

    const response = await authLogin({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '912345678',
        type: 'SMS',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I call authLogin should find a user and return success when is consultant = true', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => [{}, false]);

    const response = await authLogin({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        type: 'SMS',
        is_consultant: true,
      },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I call authLogin whith a non existant user should return error', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => null);

    const response = await authLogin({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '912345678',
        type: 'SMS',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 400,
      data: { message: 'Usuário não cadastrado' },
    });

    mockSave.mockRestore();
  });

  it('when I call create with some error should return a status of error', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await authLogin({
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
  });
});
