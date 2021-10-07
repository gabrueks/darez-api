const { updateImageApp } = require('../updateImageApp');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    ProductPhoto: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/aws', () => ({
  s3Client: {
    upload: jest.fn(() => ({
      promise: jest.fn(() => ({ key: 'imageKey' })),
    })),
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: { create: jest.fn() },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: products/updateImageApp', () => {
  it('when I call updateImageApp should update images from a product', async () => {
    const response = await updateImageApp({
      params: { ID: '1' },
      body: { files: [{ file: 'file_1', type: '.png' }] },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });

  it('when I call updateImageApp with some error should return a status of error', async () => {
    const mockSave = database.ProductPhoto.create.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await updateImageApp({
      params: { ID: '1' },
      body: { files: [{ file: 'file_1', type: '.png' }] },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
