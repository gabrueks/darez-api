const { findSubcategoriesCategory } = require('../findSubcategoriesCategory');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize:
    {
      literal: jest.fn(() => ({})),
    },
    Subcategory: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: categories/findSubcategoriesCategory', () => {
  it('when I use findSubcategoriesCategory should return all subcategories names in category', async () => {
    const mockSave = database.Subcategory.findAll.mockImplementation(() => [{ name: 'subcat 1' }, { name: 'subcat 2' }]);

    const response = await findSubcategoriesCategory({ params: { category: 'category' } });

    expect(response).toEqual({
      statusCode: 200,
      data: [{ name: 'subcat 1' }, { name: 'subcat 2' }],
    });

    mockSave.mockRestore();
  });

  it('when I use findSubcategoriesCategory with some error should return a status of error', async () => {
    const mockSave = database.Subcategory.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findSubcategoriesCategory({ params: { category: 'category' } });
    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
