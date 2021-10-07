process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findOneCompany } = require('../findOneCompany');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
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

describe('Unit Test: companies/findOneCompany', () => {
  it('when I use findOneCompany without should return company info', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnOneCompany));

    const response = await findOneCompany({ companyId: 1, params: {} });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...databaseReturnOneCompany, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findOneCompany with params should return company info for admin', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnOneCompany));

    const response = await findOneCompany({ params: { ID: 1 }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...databaseReturnOneCompany, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findOneCompany with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findOneCompany({ companyId: 1, params: {} });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
