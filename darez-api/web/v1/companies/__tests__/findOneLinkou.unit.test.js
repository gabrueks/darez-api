process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findOneLinkou } = require('../findOneLinkou');
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

const dbReturnedData = {
  id: 1,
  fantasy_name: 'Lojinha do Deco',
  banner: null,
  logo: 'logo_endpoint',
  phone_country_code: '55',
  phone_area_code: '11',
  phone_number: '912345678',
  endpoint: 'endpoint',
  instagram_url: 'insta_url',
  facebook_url: 'fb_url',
};

describe('Unit Test: companies/findOneLinkou', () => {
  it('when I call findOneLinkou should return company information using the endpoint as filter', async () => {
    const mockSave = database.Company.findOne
      .mockImplementation(() => (dbReturnedData));

    const response = await findOneLinkou({ params: { endpoint: 'url' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { ...dbReturnedData, bucket_url: 'https://s3host.teste.com/' },
    });

    mockSave.mockRestore();
  });

  it('when I call findOneLinkou with no endpoint on params should return a status of bad request', async () => {
    const mockSave = database.Company.findOne
      .mockImplementation(() => (dbReturnedData));

    const response = await findOneLinkou({ params: { } });

    expect(response).toEqual({
      statusCode: 400,
      data: { message: 'Inválido' },
    });
    mockSave.mockRestore();
  });

  it('when I call findOneLinkou with an endpoint that does not exists on db should return a status of bad request', async () => {
    const mockSave = database.Company.findOne
      .mockImplementation(() => { });

    const response = await findOneLinkou({ params: { } });

    expect(response).toEqual({
      statusCode: 400,
      data: { message: 'Inválido' },
    });
    mockSave.mockRestore();
  });

  it('when I call findOneLinkou with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findOneLinkou({ params: { endpoint: 'aurl' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
