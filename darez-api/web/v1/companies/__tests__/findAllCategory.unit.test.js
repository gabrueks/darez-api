process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findAllCategory } = require('../findAllCategory');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Company: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnCompanies = [{
  dataValues: {
    id: 1,
    user_id: 1,
    document: '012312312344',
    fantasy_name: 'Lojinha do Deco',
    cep: '01231010',
    street: 'Street',
    street_number: 200,
    address_2: null,
    neighborhood: 'Neighborhood',
    city: 'City',
    state: 'State',
    delivery_range: 5,
  },
}];

describe('Unit Test: companies/findAllCategory', () => {
  it('when I use findAllCategory should return all category from specific company', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => databaseReturnCompanies);
    const response = await findAllCategory({ params: { category: 'category' }, query: { lat: undefined, lng: undefined } });

    expect(response).toEqual({
      statusCode: 200,
      data: { companies: databaseReturnCompanies, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findAllCategory with some error should return a status of error', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const response = await findAllCategory({ params: { category: 'category' }, query: {} });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
