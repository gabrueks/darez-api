const { findOne } = require('../findOne');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Product: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnData = {
  id: 1,
  companyId: 0,
  name: 'product',
  description: 'product description',
  price: 0,
  category: 'category',
  subcategory: 'subcategory',
  created_by: 'person name',
  active: true,
  deleted_at: 'data deleted',
  created_at: 'data creation',
  updated_at: 'data updated',
};

describe('Unit Test: products/findOne', () => {
  it('when I call FindOne show product info', async () => {
    const mockSave = database.Product.findOne.mockImplementation(
      () => databaseReturnData,
    );
    const response = await findOne({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 200,
      data: databaseReturnData,
    });
    mockSave.mockRestore();
  });

  it('when I call FindOne with some error should return a status of error', async () => {
    const mockSave = database.Product.findOne.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await findOne({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
