process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findMainCompany } = require('../findMainCompany');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(),
    },
    Company: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnMainCompany = {
  id: 1,
  fantasy_name: 'fantasy_name',
  endpoint: 'endpoint',
  city: 'city',
  neighborhood: 'neighborhood',
  logo: 'logo',
  company_main_banners: [
    {
      banner_url_high_res: 'home/companies/banner-company-default.jpeg',
      banner_url_low_res: 'home/companies/banner-company-default.jpeg',
    },
  ],
};

describe('Unit Test: comapnies/findMainCompany', () => {
  it('when I use findMainCompany with Latitude and Longitude it should return the main company from the region ', async () => {
    const mockSave = database.Company.findOne.mockImplementation(
      () => (databaseReturnMainCompany),
    );
    const response = await findMainCompany({ query: { lat: 1, lng: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...databaseReturnMainCompany, bucket_url: 'https://s3host.teste.com/' },
    });
    mockSave.mockRestore();
  });

  it('when I use findMainCompany without Latitude and Longitude it should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findMainCompany({});

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
