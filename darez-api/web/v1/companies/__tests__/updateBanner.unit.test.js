const { updateBanner } = require('../updateBanner');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findOne: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/aws', () => ({
  s3Client: {
    upload: jest.fn(() => ({
      promise: jest.fn(() => ({ key: 'imageKey' })),
    })),
    deleteObject: jest.fn(() => ({
      promise: jest.fn(),
    })),
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('fs');

describe('Unit Test: companies/updateBanner', () => {
  it('when I call updateBanner of a company that already has one should update a company banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: 'banner' }));
    const response = await updateBanner({ params: { ID: '1' }, file: { destination: 'dest', filename: 'f1', path: 'filepath' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateBanner of a company that doesn not has one should update a company banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: null }));
    const response = await updateBanner({ params: { ID: '1' }, file: { destination: 'dest', filename: 'f1', path: 'filepath' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateBanner based on user token of a company that doesn not has one should update a company banner', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ banner: null }));
    const response = await updateBanner({
      companyId: '1', file: { destination: 'dest', filename: 'f1', path: 'filepath' }, params: { ID: undefined },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateBanner with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await updateBanner({ params: { ID: '1' }, file: { destination: 'dest', filename: 'f1', path: 'filepath' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
