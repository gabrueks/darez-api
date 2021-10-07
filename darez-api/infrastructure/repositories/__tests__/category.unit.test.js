const CategoryRepository = require('../category');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
    },
    Category: {
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

const databaseReturnedData = [
  {
    name: 'eletrodomestico',
  },
  {
    name: 'eletronicos',
  },
  {
    name: 'roupas',
  },
];

describe('Unit Test: Category Repository', () => {
  it('when I call find all category should return all category names', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => (databaseReturnedData));

    const categoryRepository = new CategoryRepository(database);
    const r1 = await categoryRepository.findAll(['name', 'icon', 'banner']);
    expect(r1).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call find all category and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const categoryRepository = new CategoryRepository(database);
    try {
      await categoryRepository.findAll();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call find all category given a region should return all category names in a distance range', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => (databaseReturnedData));

    const categoryRepository = new CategoryRepository(database);
    const r1 = await categoryRepository.findAllRegion(['name', 'icon', 'banner']);
    expect(r1).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call find all category given a region and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const categoryRepository = new CategoryRepository(database);
    try {
      await categoryRepository.findAllRegion(['name', 'icon', 'banner']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOne should return the banner from category', async () => {
    const mockSave = database.Category.findOne.mockImplementation(() => ({ banner: 'banner' }));

    const categoryRepository = new CategoryRepository(database);
    const r1 = await categoryRepository.findOne('category', ['banner']);
    expect(r1).toEqual({ banner: 'banner' });
    mockSave.mockRestore();
  });

  it('when I call findBanner and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Category.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const categoryRepository = new CategoryRepository(database);
    try {
      await categoryRepository.findOne('category', ['banner']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
