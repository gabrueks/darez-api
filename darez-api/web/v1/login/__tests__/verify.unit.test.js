const jwt = require('jsonwebtoken');
const { verify } = require('../verify');

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: () => 'access_token_test',
}));

describe('Unit Test: login/verify', () => {
  it('when I use verify should verify a given token', async () => {
    const mockSave = jwt.verify.mockImplementation(() => ({ data: { user_id: 1 } }));

    const response = await verify({ body: { token: 'access_token_test' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { user_id: 1 },
    });

    mockSave.mockRestore();
  });

  it('when I use verify with some error should return a status of error', async () => {
    const mockSave = jwt.verify.mockImplementation(() => { throw new Error('Some error'); });

    const response = await verify({ body: { token: 'access_token_test' } });

    expect(response).toEqual({
      statusCode: 401,
      data: { message: 'Não autorizado' },
    });

    mockSave.mockRestore();
  });
});
