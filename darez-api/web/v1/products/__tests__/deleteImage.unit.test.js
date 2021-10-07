const { deleteImage } = require('../deleteImage');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    ProductPhoto: {
      findAll: jest.fn(),
      destroy: jest.fn(),
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

describe('Unit Test: products/deleteImage', () => {
  it('when I call deleteImage should delete specific images from a product', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => [
      { photo_key: 'f1' },
      { photo_key: 'f2' },
    ]);
    const response = await deleteImage({
      params: { ID: '1' },
      body: { image_id: [1, 2] },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
  });

  it('when I call deleteImage with some error should return a status of error', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await deleteImage({
      params: { ID: '1' },
      body: { image_id: [1, 2] },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
