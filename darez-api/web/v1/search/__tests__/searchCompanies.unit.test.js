process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { searchCompanies } = require('../searchCompanies');

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../../../../infrastructure/adapters/algolia', () => ({
  client: {
    initIndex: jest.fn(() => ({
      setSettings: jest.fn(),
      saveObjects: jest.fn(),
      search: jest.fn(() => ({ hits: [{ latitude: 1, longitude: 2 }] })),
      clearObjects: jest.fn(),
    })),
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: { create: jest.fn() },
  },
}));

describe('Unit Test: search/searchCompanies', () => {
  it('When I call searchCompanies should return all companies given a lat and lng', async () => {
    const response = await searchCompanies({ body: { latitude: 1, longitude: 2 }, params: { search: 'tiradentes' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { bucket_url: 'https://s3host.teste.com/', companies: [] },
    });
  });
});
