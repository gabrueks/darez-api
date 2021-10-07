process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findOneEndpoint } = require('../findOneEndpoint');
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
    Category: {
      findOne: jest.fn(),
    },
    Product: {
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

describe('Unit Test: companies/findOneEndpoint', () => {
  it('when I call findOneEndpoint should return company information using the endpoint as filter', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnOneCompanyNoBanner));
    const mockSaveCategory = database.Category.findOne.mockImplementation(() => ({ banner: 'banner' }));
    const response = await findOneEndpoint({ params: { endpoint: 'url' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...databaseReturnOneCompany, bucket_url: 'https://s3host.teste.com/' },
    });
    mockSave.mockRestore();
    mockSaveCategory.mockRestore();
  });

  it('when I call findOneEndpoint with no endpoint on params should return a status of bad request', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnOneCompanyNoBanner));
    const mockSaveCategory = database.Category.findOne.mockImplementation(() => ({ banner: 'banner' }));
    const response = await findOneEndpoint({ params: { } });

    expect(response).toEqual({
      statusCode: 400,
      data: { message: 'Inválido' },
    });
    mockSave.mockRestore();
    mockSaveCategory.mockRestore();
  });

  it('when I call findOneEndpoint with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await findOneEndpoint({ params: { endpoint: '1url' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
