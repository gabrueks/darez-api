const { findAll } = require('../findAll');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    User: {
      findAll: jest.fn(),
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

describe('Unit Test: users/findAll', () => {
  it('when I use findAll should return All users information with success code', async () => {
    const dbAnswer = {
      id: 1,
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      confirmation_code: '123456',
      last_consultor_name_login: 'Last Consultor Name',
      full_name: 'Full Name',
      created_by: 'Name Of Creator',
      last_user_login: '2020-08-13T01:16:16.000Z',
      created_at: '2020-08-05T22:45:04.000Z',
      updated_at: '2020-08-13T22:21:40.000Z',
      last_consultor_login: '2020-08-13T21:25:33.000Z',
      confirmation_code_requested_at: '2020-08-13T21:24:11.000Z',
      new_user: false,
      active: true,
    };
    const mockSave = database.User.findAll.mockImplementation(() => dbAnswer);

    const response = await findAll({ query: { page: 0, pageSize: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: dbAnswer,
    });

    mockSave.mockRestore();
  });

  it('when I use findAll with some error should return a status of error', async () => {
    const mockSave = database.User.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findAll({ query: { page: 0, pageSize: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
