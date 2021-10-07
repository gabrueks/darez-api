const { indexProducts } = require('../searchProductsIndex');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Product: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../../../../infrastructure/adapters/algolia', () => ({
  client: {
    initIndex: jest.fn(() => ({
      setSettings: jest.fn(),
      saveObjects: jest.fn(),
      search: jest.fn(() => ({ hits: [{ latitude: 1, longitude: 2 }] })),
      clearObjects: jest.fn(),
    })),
  },
}));

describe('Unit Test: search/searchProductsIndex', () => {
  it('When I call indexProducts should return all products info', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => ([{
      id: 1,
      company_id: 1,
      name: 'Name',
      description: 'description',
      price: 10,
      category: 'category',
      subcategory: 'subcategory',
      ProductPhotos: [{ photo_key: 'photo' }],
      Company: {
        fantasy_name: 'Fantasy Name',
        latitude: 1,
        longitude: 2,
        delivery_range: 5,
      },
    }]));
    const response = await indexProducts();
    expect(response).toEqual({
      statusCode: 200,
      data: [{
        objectID: 1,
        company_id: 1,
        name: 'Name',
        description: 'description',
        price: 10,
        category: 'category',
        subcategory: 'subcategory',
        photos: ['photo'],
        fantasy_name: 'Fantasy Name',
        latitude: 1,
        longitude: 2,
        delivery_range: 5,
      }],
    });

    mockSave.mockRestore();
  });

  it('When I call indexProducts with some error should return a status of error', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const response = await indexProducts();

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
