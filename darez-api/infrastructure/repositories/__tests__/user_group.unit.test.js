const UserGroupRepository = require('../user_group');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    UserGroup: {
      findOne: jest.fn(),
    },
  },
}));

describe('Unit Test: UserGroupRepository', () => {
  it('when I call findOne then should return its data', async () => {
    const mockSave = database.UserGroup.findOne.mockImplementation(() => (
      { get_all_companies: 0 }));

    const userGroupRepository = new UserGroupRepository(database);
    const data = await userGroupRepository.findOne(['get_all_companies'], 1);

    expect(data).toEqual({ get_all_companies: 0 });
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserGroup.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userGroupRepository = new UserGroupRepository(database);

    try {
      await userGroupRepository.findOne(['get_all_companies'], 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOneName then should return its data', async () => {
    const mockSave = database.UserGroup.findOne.mockImplementation(() => (1));

    const userGroupRepository = new UserGroupRepository(database);
    const data = await userGroupRepository.findOneName(['id'], 'default');

    expect(data).toEqual(1);
    mockSave.mockRestore();
  });

  it('when I call findOneName and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserGroup.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userGroupRepository = new UserGroupRepository(database);

    try {
      await userGroupRepository.findOneName(['id'], 'default');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
