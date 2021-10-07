const UserAddressRepository = require('../user_address');

const { database } = require('../../adapters/database');

const databaseAddressData = {
  user_id: 1,
  cep: '18090602',
  street: 'street',
  street_number: 100,
  address_2: 'address_2',
  neighborhood: 'neighborhood',
  city: 'city',
  state: 'SP',
  latitude: -23.5724403,
  longitude: -46.6903144,
};

jest.mock('../../adapters/database', () => ({
  database: {
    UserAddresses: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

describe('Unit Test: UserAdressRepository', () => {
  it('when I call update should update a user address', async () => {
    const mockSave = database.UserAddresses.update.mockImplementation(() => [1]);
    const userAddressRepository = new UserAddressRepository(database);
    const result = await userAddressRepository.update({
      user_id: 1,
      cep: '18090602',
      street: 'street',
      street_number: 100,
      address_2: 'address_2',
      neighborhood: 'neighborhood',
      city: 'city',
      state: 'SP',
      latitude: -23.5724403,
      longitude: -46.6903144,
    }, 1);
    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call create should create a user address', async () => {
    const mockSave = database.UserAddresses.create.mockImplementation(() => databaseAddressData);
    const userAddressRepository = new UserAddressRepository(database);
    const result = await userAddressRepository.create({
      user_id: 1,
      cep: '18090602',
      street: 'street',
      street_number: 100,
      address_2: 'address_2',
      neighborhood: 'neighborhood',
      city: 'city',
      state: 'SP',
      latitude: -23.5724403,
      longitude: -46.6903144,
    }, 1);
    expect(result).toEqual(databaseAddressData);

    mockSave.mockRestore();
  });

  it('when I call findAll then should return all users addresses information', async () => {
    const mockSave = database.UserAddresses.findAll.mockImplementation(() => (databaseAddressData));

    const userAddressRepository = new UserAddressRepository(database);
    const data = await userAddressRepository.findAll({ userId: 1 });

    expect(data).toEqual(databaseAddressData);
    mockSave.mockRestore();
  });

  it('when I call findAll and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserAddresses.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const userAddressRepository = new UserAddressRepository(database);
    try {
      await userAddressRepository.findAll();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserAddresses.update.mockImplementation(() => { throw new Error('Some error'); });
    const userAddressRepository = new UserAddressRepository(database);
    try {
      await userAddressRepository.update({ id: 1, cep: 1809602 }, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserAddresses.create.mockImplementation(() => { throw new Error('Some error'); });
    const userAddressRepository = new UserAddressRepository(database);
    try {
      await userAddressRepository.create({}, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call logicalDelete should update the active value to 0', async () => {
    const mockSave = database.UserAddresses.update.mockImplementation(() => [1]);
    const userAddressRepository = new UserAddressRepository(database);

    const result = await userAddressRepository.logicalDelete([1], 1);
    expect(result).toEqual([1]);

    mockSave.mockRestore();
  });

  it('when I call logicalDelete and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserAddresses.update.mockImplementation(() => { throw new Error('Some error'); });
    const userAddressRepository = new UserAddressRepository(database);
    try {
      await userAddressRepository.logicalDelete([1], 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
