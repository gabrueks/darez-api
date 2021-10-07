process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findAllProducts } = require('../findAllProducts');
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

describe('Unit Test: companies/findAllProducts', () => {
  it('when I use findAllProducts with ID in query should return all products from specific company', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [databaseRetunrProducts]);
    const response = await findAllProducts({ query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { products: [databaseRetunrProducts], bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findAllProducts with token in query should return all products from specific company', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [databaseRetunrProducts]);
    const response = await findAllProducts({ query: { token: 'some_token' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { products: [databaseRetunrProducts], bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findAllProducts with company that has main image should return main image', async () => {
    const mockSave = database.Product.findAll
      .mockImplementationOnce(() => [databaseRetunrProducts])
      .mockImplementationOnce(() => [{ 'ProductPhotos.product_id': 10, 'ProductPhotos.photo_key': 'photo_key' }]);
    const response = await findAllProducts({ query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { products: [{ ...databaseRetunrProducts, photo_key: 'photo_key' }], bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findAllProducts with company that does not have main image should return any picture', async () => {
    const mockSave = database.Product.findAll
      .mockImplementationOnce(() => [databaseRetunrProducts])
      .mockImplementationOnce(() => []);
    const response = await findAllProducts({ query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { products: [databaseRetunrProducts], bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findAllProducts with some error should return a status of error', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const response = await findAllProducts({ query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
