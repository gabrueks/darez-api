const { updateImage } = require('../updateImage');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    ProductPhoto: {
      create: jest.fn(),
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

jest.mock('jimp', () => ({
  read: jest.fn(() => ({
    bitmap: { height: 1000, width: 1000 },
    scaleToFit: jest.fn(() => ({
      quality: jest.fn(() => ({
        write: jest.fn(),
      })),
    })),
  })),
}));

jest.mock('fs');

describe('Unit Test: products/updateImage', () => {
  it('when I call updateImage should update images from a product', async () => {
    const mockSave = database.ProductPhoto.create
      .mockImplementation(() => ({ id: 1 }));

    const response = await updateImage({
      params: { ID: '1' },
      files: [{ destination: 'dest', filename: 'f1', path: 'path' }],
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I call updateImage with some error should return a status of error', async () => {
    const mockSave = database.ProductPhoto.create.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await updateImage({
      params: { ID: '1' },
      files: [{ destination: 'dest', filename: 'f1', path: 'path' }],
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
