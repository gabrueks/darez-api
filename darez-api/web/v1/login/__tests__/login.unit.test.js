// const jwt = require('jsonwebtoken');
const { login } = require('..');
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
    Company: {
      findOne: jest.fn(),
    },
    UserLogin: {
      create: jest.fn(),
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

jest.mock('../../helpers/generateApiKey', () => (jest.fn()));

jest.mock('../../analytics', () => ({
  createSession: jest.fn(),
}));

describe('Unit Test: login/login', () => {
  it('when I use login should return success with token and some user information', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({
      id: 1, new_user: false, full_name: 'Full Name', user_group: 2, a_b_group: 0,
    }));

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '123456',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        full_name: 'Full Name',
        user_group: 2,
        a_b_group: 0,
        company_id: null,
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
  });

  it('when I call login of a user that has a company should return success with token and some user information', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({
      id: 1, new_user: false, full_name: 'Full Name', user_group: 2, a_b_group: 0,
    }));
    const mockSave2 = database.Company.findOne.mockImplementation(() => ({ id: 882 }));

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '123456',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        full_name: 'Full Name',
        user_group: 2,
        a_b_group: 0,
        company_id: 882,
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I use login with first time user should return success with token and some user information', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => (
      {
        id: 1, new_user: true, full_name: null, user_group: 2, a_b_group: 0,
      }
    ));

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '123456',
        is_consultant: false,
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        full_name: null,
        user_group: 2,
        a_b_group: 0,
        company_id: null,
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
  });

  it('when I use login from specific host should return success with token and some user information', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({
      id: 1, new_user: false, full_name: 'Full Name', user_group: 2, a_b_group: 0,
    }));

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '289732',
        is_consultant: true,
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        full_name: 'Full Name',
        user_group: 2,
        a_b_group: 0,
        company_id: null,
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
  });

  it('when I use login with first time user from specific host should return success with token and some user information', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({
      id: 1, new_user: true, full_name: null, user_group: 2, a_b_group: 0,
    }));

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '289732',
        is_consultant: true,
      },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        access_token: 'access_token_test',
        full_name: null,
        user_group: 2,
        a_b_group: 0,
        company_id: null,
        refresh_token: 'access_token_test',
      },
    });

    mockSave.mockRestore();
  });

  it('when I use login and no user is found should return unauthorized', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => null);

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '289242',
      },
    });

    expect(response).toEqual({
      statusCode: 401,
      data: {
        message: 'Não autorizado',
      },
    });

    mockSave.mockRestore();
  });

  it('when I use login with nonexistant consultant code should return unauthorized', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({
      id: 1, new_user: true, full_name: null, user_group: 2, a_b_group: 0,
    }));

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '707070707070',
        is_consultant: true,
      },
    });

    expect(response).toEqual({
      statusCode: 401,
      data: {
        message: 'Não autorizado',
      },
    });
    mockSave.mockRestore();
  });

  it('when I use login with some error should return a status of error', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await login({
      body: {
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '972814040',
        confirmation_code: '289732',
        is_consultant: true,
      },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
