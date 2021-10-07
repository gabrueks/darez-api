const UserRepository = require('../user');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    User: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findOrCreate: jest.fn(),
    },
  },
}));

const databaseReturnedData = {
  id: 1,
  phone_country_code: '55',
  phone_area_code: '11',
  phone_number: '997463524',
};

describe('Unit Test: UserRepository', () => {
  it('when I call findOrCreate to create then should create an user and return his data with created true', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => [
      databaseReturnedData, true]);

    const userRepository = new UserRepository(database);
    const [user, created] = await userRepository.findOrCreate({
      phone: {
        phoneCountryCode: '55',
        phoneAreaCode: '11',
        phoneNumber: '997463524',
      },
      confirmationCode: 12345,
      confirmationCodeRequestedAt: null,
    });

    expect(user).toEqual(databaseReturnedData);
    expect(created).toBeTruthy();
    mockSave.mockRestore();
  });

  it('when I call findOrCreate and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);

    try {
      await userRepository.findOrCreate({
        phone: {
          phoneCountryCode: '55',
          phoneAreaCode: '11',
          phoneNumber: '997463524',
        },
        confirmationCode: 12345,
        confirmationCodeRequestedAt: null,
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOrCreate to find then should return an user and return his data with created false', async () => {
    const mockSave = database.User.findOrCreate.mockImplementation(() => [
      databaseReturnedData, false]);

    const userRepository = new UserRepository(database);
    const [user, created] = await userRepository.findOrCreate({
      phone: {
        phoneCountryCode: '55',
        phoneAreaCode: '11',
        phoneNumber: '997463524',
      },
      confirmationCode: 12345,
      confirmationCodeRequestedAt: null,
    });

    expect(user).toEqual(databaseReturnedData);
    expect(!created).toBeTruthy();
    mockSave.mockRestore();
  });

  it('when I call findOne should return all infos from a user given some id', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => (databaseReturnedData));

    const userRepository = new UserRepository(database);
    const result = await userRepository.findOne(1);

    expect(result).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);
    try {
      await userRepository.findOne(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call updateConfirmationCode should update a user confirmation code', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const userRepository = new UserRepository(database);
    const result = await userRepository.updateConfirmationCode('userId', 'confirmationCode', 'confirmationCodeRequestedAt');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call updateConfirmationCode and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.update.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);
    try {
      await userRepository.updateConfirmationCode('userId', 'confirmationCode', 'confirmationCodeRequestedAt');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update a user', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const userRepository = new UserRepository(database);
    const result = await userRepository.update({ full_name: 'New Name', phone_number: '912345678' }, 1);

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.update.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);
    try {
      await userRepository.update({ full_name: 'New Name', phone_number: '912345678' }, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call updateUserLastLogin should update a user last login time', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const userRepository = new UserRepository(database);
    const result = await userRepository.updateUserLastLogin('userId', 'time');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call updateUserLastLogin and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.update.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);
    try {
      await userRepository.updateUserLastLogin('userId', 'time');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call updateConsultorLastLogin should update a user last consultor login time and the consultor name', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const userRepository = new UserRepository(database);
    const result = await userRepository.updateConsultorLastLogin('userId', 'time', 'consultor');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call updateConsultorLastLogin and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.update.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);
    try {
      await userRepository.updateConsultorLastLogin('userId', 'time', 'consultor');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call updateCreatedBy should update a user creator and change new_user flag to false', async () => {
    const mockSave = database.User.update.mockImplementation(() => [1]);

    const userRepository = new UserRepository(database);
    const [affectedRows] = await userRepository.updateCreatedBy(1, 'creator', 'transaction');

    expect(affectedRows).toEqual(1);
    mockSave.mockRestore();
  });

  it('when I call updateCreatedBy and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.update.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);

    try {
      await userRepository.updateCreatedBy(1, 'creator', 'transaction');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findUserGroup then should return the user group', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({ user_group: 2 }));

    const userRepository = new UserRepository(database);
    const data = await userRepository.findUserGroup(1);

    expect(data).toEqual({ user_group: 2 });
    mockSave.mockRestore();
  });

  it('when I call findUserGroup and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);

    try {
      await userRepository.findUserGroup(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findUserLoginCode then should return the user confirmation code and fullname', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({ confirmation_code: 123456, full_name: 'Full Name' }));

    const userRepository = new UserRepository(database);
    const data = await userRepository.findUserLoginCode(1);

    expect(data).toEqual({ confirmation_code: 123456, full_name: 'Full Name' });
    mockSave.mockRestore();
  });

  it('when I call findUserLoginCode and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);

    try {
      await userRepository.findUserLoginCode(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAll then should return all users information', async () => {
    const mockSave = database.User.findAll.mockImplementation(() => (databaseReturnedData));

    const userRepository = new UserRepository(database);
    const data = await userRepository.findAll({ page: 0, pageSize: 1 });

    expect(data).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call findUserLoginCode and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);

    try {
      await userRepository.findAll({ page: 0, pageSize: 1 });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOneTokenBased then should return the user attributes', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => ({ id: 1 }));

    const userRepository = new UserRepository(database);
    const data = await userRepository.findOneTokenBased('defaultToken', 'refreshToken', ['id']);

    expect(data).toEqual({ id: 1 });
    mockSave.mockRestore();
  });

  it('when I call findOneTokenBased and some exception occurs then should throw an exception', async () => {
    const mockSave = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userRepository = new UserRepository(database);

    try {
      await userRepository.findOneTokenBased('defaultToken', 'refreshToken', ['id']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
