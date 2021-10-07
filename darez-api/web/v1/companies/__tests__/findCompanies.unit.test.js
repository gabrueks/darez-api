process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findCompanies } = require('../findCompanies');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
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

describe('Unit Test: companies/findCompanies', () => {
  it('when I use findCompanies should return all companies', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => databaseReturnCompanies);

    const response = await findCompanies({ query: { lat: 1.000001, lng: 2.200002 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { bucket_url: 'https://s3host.teste.com/', companies: databaseReturnCompanies },
    });

    mockSave.mockRestore();
  });

  it('when I use findCompanies with some error should return a status of error', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findCompanies({ query: { lat: 1.000001, lng: 2.200002 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
