const { deleteBanner } = require('../deleteBanner');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findAll: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/aws', () => ({
  s3Client: {
    deleteObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: companies/deleteBanner', () => {
  it('when I call deleteBanner with params from a company that has one should delete a company banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: 'banner' }));
    const response = await deleteBanner({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call deleteBanner with token from a company that has one should delete a company banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: 'banner' }));
    const response = await deleteBanner({ params: { ID: undefined }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call deleteBanner from a company that does not has one should do nothing and return sucess', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: null }));
    const response = await deleteBanner({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call deleteBanner with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await deleteBanner({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
