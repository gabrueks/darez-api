const { updateLogo } = require('../updateLogo');
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

describe('Unit Test: companies/updateLogo', () => {
  it('when I call updateLogo of a company that already has one should update a company logo', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ logo: 'logo' }));
    const response = await updateLogo({ params: { ID: '1' }, file: { destination: 'dest', filename: 'f1', path: 'filepath' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateLogo based on params id of a company that doesn not has one should update a company logo', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ logo: null }));
    const response = await updateLogo({ params: { ID: '1' }, file: { destination: 'dest', filename: 'f1', path: 'filepath' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateLogo based on user token of a company that doesn not has one should update a company logo', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ logo: null }));
    const response = await updateLogo({
      companyId: '1', file: { destination: 'dest', filename: 'f1', path: 'filepath' }, params: { ID: undefined },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateLogo with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await updateLogo({ params: { ID: '1' }, file: { destination: 'dest', filename: 'f1', path: 'filepath' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
