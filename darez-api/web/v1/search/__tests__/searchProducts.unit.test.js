process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { searchProducts } = require('../searchProducts');

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

describe('Unit Test: search/searchProducts', () => {
  it('When I call searchProducts should return all companies given a lat and lng', async () => {
    const response = await searchProducts({ body: { latitude: 1, longitude: 2 }, params: { search: 'company' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { bucket_url: 'https://s3host.teste.com/', products: [] },
    });
  });
});
