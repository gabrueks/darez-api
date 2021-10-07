process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findProductsFromCategoryCompany } = require('../findProductsFromCategoryCompany');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Product: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('jsonwebtoken', () => ({
  decode: () => ({
    data: { user_id: 1, company_id: 1 },
  }),
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseRetunrProducts = {
  id: 10,
  company_id: 1,
  name: 'nome',
  description: 'um vestido leve',
  price: 200.00,
  category: 'category',
  subcategory: 'subcategory',
};

describe('Unit Test: companies/findProductsFromCategoryCompany', () => {
  it('when I use findProductsFromCategoryCompany with ID in query should return all product from company in category', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [databaseRetunrProducts]);

    const response = await findProductsFromCategoryCompany({ params: { category: 'category' }, query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { products: [databaseRetunrProducts], bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findProductsFromCategoryCompany with token in query should return all product from company in category', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [databaseRetunrProducts]);

    const response = await findProductsFromCategoryCompany({ params: { category: 'category' }, query: { token: 'some_token' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { products: [databaseRetunrProducts], bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findProductsFromCategoryCompany with some error should return a status of error', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findProductsFromCategoryCompany({ params: { category: 'category' }, query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
