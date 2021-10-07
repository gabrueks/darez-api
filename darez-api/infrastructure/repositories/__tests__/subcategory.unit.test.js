const SubcategoryRepository = require('../subcategory');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Subcategory: {
      findAll: jest.fn(),
    },
  },
}));

const databaseReturnedData = [
  {
    name: 'subcategory1',
  },
  {
    name: 'subcategory2',
  },
];

describe('Unit Test: Subcategory Repository', () => {
  it('when I call findAllSubcategoryCategory should return all subcategory names in category', async () => {
    const mockSave = database.Subcategory.findAll.mockImplementation(() => (databaseReturnedData));

    const subcategoryRepository = new SubcategoryRepository(database);
    const r1 = await subcategoryRepository.findAllSubcategoryCategory('category');
    expect(r1).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call findAllSubcategoryCategory and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Subcategory.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const subcategoryRepository = new SubcategoryRepository(database);
    try {
      await subcategoryRepository.findAllSubcategoryCategory('category');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
