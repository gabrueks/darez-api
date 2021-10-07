const UserLoginRepository = require('../user_login');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    UserLogin: {
      create: jest.fn(),
    },
  },
}));

describe('Unit Test: UserGroupRepository', () => {
  it('when I call create should create a new user login', async () => {
    const mockSave = database.UserLogin.create.mockImplementation(() => (
      { user_id: 1, is_consultant: false, consultor_name: null }));

    const userLoginRepository = new UserLoginRepository(database);
    const data = await userLoginRepository.create({
      user_id: 1, is_consultant: false, consultor_name: null,
    });

    expect(data).toEqual({ user_id: 1, is_consultant: false, consultor_name: null });
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserLogin.create.mockImplementation(() => { throw new Error('Some error'); });

    const userLoginRepository = new UserLoginRepository(database);

    try {
      await userLoginRepository.create({
        user_id: 1, is_consultant: false, consultor_name: null,
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
