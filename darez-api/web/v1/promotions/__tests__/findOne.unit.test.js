process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findOne } = require('../findOne');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Promotion: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const resultFindReturnDate = {
  id: 1,
  company_id: 1,
  discount: 1,
  has_limit_date: 1,
  date_start: '00/00/0000',
  date_end: '00/00/0000',
  created_by: 'person name',
  products: [
    {
      id: 1,
      name: 'product',
      description: 'product description',
      price: 100,
      promotion_price: 90,
      quantity: 1,
      category: 'category',
      subcategory: 'subcategory',
      created_by: 'person name',
      photo_key: ['urlPhoto'],
    },
  ],
};

const databaseReturnData = {
  id: 1,
  company_id: 1,
  discount: 1,
  has_limit_date: 1,
  date_start: '00/00/0000',
  date_end: '00/00/0000',
  created_by: 'person name',
  Products: [{
    id: 1,
    name: 'product',
    description: 'product description',
    price: 100,
    promotion_price: 90,
    quantity: 1,
    category: 'category',
    subcategory: 'subcategory',
    created_by: 'person name',
    ProductPhotos: [{
      photo_key: 'urlPhoto',
    }],
  }],
};

describe('Unit Test: promotions/findOne', () => {
  it('when I call findOne should return all promotions from a company', async () => {
    const mockSave = database.Promotion.findOne.mockImplementation(() => (
      { dataValues: { ...databaseReturnData } }
    ));
    const response = await findOne({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { promotion: { ...resultFindReturnDate }, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });
});
