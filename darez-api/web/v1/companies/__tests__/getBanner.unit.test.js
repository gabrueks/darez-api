process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { getBanner } = require('../getBanner');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findOne: jest.fn(),
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

jest.mock('jsonwebtoken', () => ({
  decode: () => ({
    data: { user_id: 1, company_id: 1 },
  }),
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: companies/getBanner', () => {
  it('when I call getBanner with ID in query from a company should return a company banner and the bucker url', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: 'banner/banner_key' }));
    const response = await getBanner({ query: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { banner: 'banner/banner_key', bucket_url: 'https://s3host.teste.com/' },
    });
    mockSave.mockRestore();
  });

  it('when I call getBanner with token in query from a company should return a company banner and the bucker url', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: 'banner/banner_key' }));
    const response = await getBanner({ query: { token: 'some_token' } });

    expect(response).toEqual({
      statusCode: 200,
      data: { banner: 'banner/banner_key', bucket_url: 'https://s3host.teste.com/' },
    });
    mockSave.mockRestore();
  });

  it('when I call getBanner with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await getBanner({ query: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
