process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findOneNoLogin } = require('../findOneNoLogin');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Company: {
      findOne: jest.fn(),
    },
    Product: {
      findOne: jest.fn(),
    },
    Category: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnOneCompany = {
  id: 1,
  user_id: 1,
  document: '012312312344',
  fantasy_name: 'Lojinha do Deco',
  cep: '01231010',
  street: 'Street',
  street_number: 200,
  address_2: null,
  neighborhood: 'Neighborhood',
  banner: 'banner',
  city: 'City',
  state: 'State',
  delivery_range: 5,
};

const databaseReturnOneCompanyNoBanner = {
  id: 1,
  user_id: 1,
  document: '012312312344',
  fantasy_name: 'Lojinha do Deco',
  cep: '01231010',
  street: 'Street',
  street_number: 200,
  address_2: null,
  neighborhood: 'Neighborhood',
  banner: null,
  city: 'City',
  state: 'State',
  delivery_range: 5,
};

const databaseReturnWithCategoryNoBanner = {
  id: 1,
  user_id: 1,
  document: '012312312344',
  fantasy_name: 'Lojinha do Deco',
  cep: '01231010',
  street: 'Street',
  street_number: 200,
  address_2: null,
  neighborhood: 'Neighborhood',
  banner: null,
  category: 'category',
  city: 'City',
  state: 'State',
  delivery_range: 5,
};

const resultCategoryNoBanner = {
  id: 1,
  user_id: 1,
  document: '012312312344',
  fantasy_name: 'Lojinha do Deco',
  cep: '01231010',
  street: 'Street',
  street_number: 200,
  address_2: null,
  neighborhood: 'Neighborhood',
  banner: 'banner',
  category: 'category',
  city: 'City',
  state: 'State',
  delivery_range: 5,
};

describe('Unit Test: companies/findOneNoLogin', () => {
  it('when I use findOneNoLogin should return one company', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => databaseReturnOneCompany);
    const mockSaveProduct = database.Product.findOne.mockImplementation(() => ({ category: 'category' }));
    const mockSaveCategory = database.Category.findOne.mockImplementation(() => ({ banner: 'banner' }));

    const response = await findOneNoLogin({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...databaseReturnOneCompany, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
    mockSaveProduct.mockRestore();
    mockSaveCategory.mockRestore();
  });

  it('when I use findOneNoLogin without banner ans category should return one company with most products category banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnOneCompanyNoBanner));
    const mockSaveProduct = database.Product.findOne.mockImplementation(() => ({ category: 'category' }));
    const mockSaveCategory = database.Category.findOne.mockImplementation(() => ({ banner: 'banner' }));

    const response = await findOneNoLogin({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...databaseReturnOneCompany, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
    mockSaveProduct.mockRestore();
    mockSaveCategory.mockRestore();
  });

  it('when I use findOneNoLogin without banner and with category should return one company info with its category banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnWithCategoryNoBanner));
    const mockSaveCategory = database.Category.findOne.mockImplementation(() => ({ banner: 'banner' }));

    const response = await findOneNoLogin({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...resultCategoryNoBanner, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
    mockSaveCategory.mockRestore();
  });

  it('when I use findOneNoLogin with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findOneNoLogin({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
