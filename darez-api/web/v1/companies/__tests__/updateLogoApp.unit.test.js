const { updateLogoApp } = require('../updateLogoApp');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findOne: jest.fn(),
      update: jest.fn(),
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

describe('Unit Test: companies/updateLogoApp', () => {
  it('when I call updateLogoApp of a company that already has one should update a company logo', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ logo: 'logo' }));
    const response = await updateLogoApp({ params: { ID: '1' }, body: { file: 'file', type: 'type' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateLogoApp based on params id of a company that doesn not has one should update a company logo', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ logo: null }));
    const response = await updateLogoApp({ params: { ID: '1' }, body: { file: 'file', type: 'type' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateLogoApp based on user token of a company that doesn not has one should update a company logo', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ logo: null }));
    const response = await updateLogoApp({
      companyId: '1', body: { file: 'file', type: 'type' }, params: { ID: undefined },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call updateLogoApp with some error should return a status of error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await updateLogoApp({ params: { ID: '1' }, body: { file: 'file', type: 'type' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
