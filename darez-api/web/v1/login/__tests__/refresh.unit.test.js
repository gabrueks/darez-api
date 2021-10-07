const jwt = require('jsonwebtoken');
const { refresh } = require('../refresh');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    User: {
      findOne: jest.fn(),
      update: jest.fn(),
    },
    Company: {
      findOne: jest.fn(),
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

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: () => 'access_token_test',
}));

describe('Unit Test: login/refresh', () => {
  it('when I use refresh should refresh a token and return it', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({ id: 1 }));
    const mockSave2 = database.Company.findOne.mockImplementation(() => ({ id: 1 }));

    const response = await refresh({
      body: {
        access_token: 'access_token_test',
        refresh_token: 'refresh_token_test',
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I use refresh to a valid token and user does not have company should refresh a token and return it', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({ id: 1 }));
    const mockSave2 = database.Company.findOne.mockImplementation(() => null);

    const response = await refresh({
      body: {
        access_token: 'access_token_test',
        refresh_token: 'refresh_token_test',
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I use refresh to a valid token but no user found should return unauthorized', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => null);

    const response = await refresh({
      body: {
        access_token: 'access_token_test',
        refresh_token: 'refresh_token_test',
      },
    });

    expect(response).toEqual({
      statusCode: 401,
      data: { message: 'Não autorizado' },
    });

    mockSave.mockRestore();
  });

  it('when I use refresh with unauthorized token should return unauthorized', async () => {
    const mockSave = jwt.verify.mockImplementation(() => { throw new Error('Some error'); });

    const response = await refresh({
      body: {
        access_token: 'access_token_test',
        refresh_token: 'refresh_token_test',
      },
    });

    expect(response).toEqual({
      statusCode: 401,
      data: { message: 'Não autorizado' },
    });

    mockSave.mockRestore();
  });
});
