jest.mock('fs');
const BusinessHours = require('../business_hours');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    BusinessHours: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

describe('Unit Test: Business Hour Repository', () => {
  it('when I call createOrUpdate and findOne when findOne return false then should create a business hour schedule', async () => {
    const mockSave = database.BusinessHours.findOne.mockImplementation(() => (0));

    const businessHours = new BusinessHours(database);
    await businessHours.createOrUpdate({ schedule: 'schedule' }, 1);

    expect(database.BusinessHours.findOne).toHaveBeenCalledTimes(1);
    expect(database.BusinessHours.create).toHaveBeenCalledTimes(1);
    expect(database.BusinessHours.update).toHaveBeenCalledTimes(0);
    mockSave.mockRestore();
  });

  it('when I call createOrUpdate and findOne when findOne return true then should update a business hour schedule', async () => {
    const mockSave = database.BusinessHours.findOne.mockImplementation(() => (1));

    const businessHours = new BusinessHours(database);
    await businessHours.createOrUpdate({ schedule: 'schedule' }, 1);

    expect(database.BusinessHours.findOne).toHaveBeenCalledTimes(1);
    expect(database.BusinessHours.update).toHaveBeenCalledTimes(1);
    expect(database.BusinessHours.create).toHaveBeenCalledTimes(0);
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockFindOneSave = database.BusinessHours.findOne.mockImplementation(() => (0));
    const mockCreateSave = database.BusinessHours.create.mockImplementation(() => { throw new Error('Some error'); });

    const businessHours = new BusinessHours(database);
    try {
      await businessHours.createOrUpdate({ schedule: 'schedule' }, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockFindOneSave.mockRestore();
    mockCreateSave.mockRestore();
  });
});
