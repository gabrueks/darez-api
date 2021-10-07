const { findDocument } = require('../findDocument');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    User: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: users/findDocument', () => {
  it('when I use findDocument should return a single user information with success code', async () => {
    const dbAnswer = {
      id: 1292,
      phone_country_code: '55',
      phone_area_code: '15',
      phone_number: '988332828',
      confirmation_code: '000000',
      confirmation_code_requested_at: '2020-07-16T13:00:00.000Z',
      last_consultor_name_login: 'last_consultor_name_login',
      active: 1,
      full_name: 'full_name',
      last_user_login: '2020-08-21T16:57:05.000Z',
      last_consultor_login: 'last_consultor_login',
      created_by: 'created_by',
      new_user: 1,
      user_group: 1,
      document: '62247097006',
      created_at: '2020-08-13T21:52:48.000Z',
      updated_at: '2020-09-11T17:42:07.000Z',
    };
    const mockSave = database.User.findOne.mockImplementation(() => dbAnswer);

    const response = await findDocument({ params: { ID: '1292' } });

    expect(response).toEqual({
      statusCode: 200,
      data: dbAnswer,
    });

    mockSave.mockRestore();
  });

  it('when I use findDocument with some error should return a status of error', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findDocument({ DOCUMENT: 1 });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
