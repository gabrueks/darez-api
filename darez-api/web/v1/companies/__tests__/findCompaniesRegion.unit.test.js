process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findCompaniesRegion } = require('../findCompaniesRegion');
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

const databaseRetunDataFRegions = [
  {
    id: 2,
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
    distance: 0,
    phone_country_code: '55',
    phone_area_code: '11',
    phone_number: '000000000',
    logo: 'logos/1234_IMAGE12414',
    total_products: 2,
  },
];

describe('Unit Test: companies/findCompaniesRegion', () => {
  it('when I use findCompaniesRegion should return all companies from a range', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (databaseRetunDataFRegions));

    const response = await findCompaniesRegion({ query: { lat: 1.000001, lng: 2.200002 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { companies: databaseRetunDataFRegions, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I use findCompaniesRegion with some error should return a status of error', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findCompaniesRegion({ query: { lat: 1.000001, lng: 2.200002 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
