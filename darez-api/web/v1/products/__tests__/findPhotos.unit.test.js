process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findPhotos } = require('../findPhotos');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    ProductPhoto: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: products/findPhotos', () => {
  it('when I call findPhotos should return all photos from a product', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => [
      { dataValues: 'images' },
    ]);
    const response = await findPhotos({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        bucket_url: 'https://s3host.teste.com/',
        images: [{ dataValues: 'images' }],
      },
    });

    mockSave.mockRestore();
  });

  it('when I call findPhotos with some error should return a status of error', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await findPhotos({ params: { ID: 1 } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
