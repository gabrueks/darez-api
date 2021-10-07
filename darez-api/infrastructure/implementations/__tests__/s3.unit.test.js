const S3Implementation = require('../s3');

jest.mock('fs');

describe('Unit Test: S3 Implementation', () => {
  it('when I call uploadFile should call upload once', async () => {
    const s3Client = {
      upload: jest.fn(() => ({
        promise: jest.fn(),
      })),
    };

    const s3 = new S3Implementation(s3Client);
    await s3.uploadFile('image', 'local');
    expect(s3.s3Client.upload).toHaveBeenCalledTimes(1);
  });

  it('when I call uploadFile and have some error then should throw an exception', async () => {
    const s3Client = {
      upload: jest.fn(() => { throw new Error('Some error'); }),
    };

    const s3 = new S3Implementation(s3Client);
    try {
      await s3.uploadFile('image', 'local');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });

  it('when I call deleteFile should upload deleteObject', async () => {
    const s3Client = {
      deleteObject: jest.fn(() => ({
        promise: jest.fn(),
      })),
    };

    const s3 = new S3Implementation(s3Client);
    await s3.deleteFile('image');
    expect(s3.s3Client.deleteObject).toHaveBeenCalledTimes(1);
  });

  it('when I call deleteFile and have some error then should throw an exception', async () => {
    const s3Client = {
      deleteObject: jest.fn(() => { throw new Error('Some error'); }),
    };

    const s3 = new S3Implementation(s3Client);
    try {
      await s3.deleteFile('image');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });

  it('when I call uploadBase64 should call upload once', async () => {
    const s3Client = {
      upload: jest.fn(() => ({
        promise: jest.fn(),
      })),
    };

    const s3 = new S3Implementation(s3Client);
    await s3.uploadBase64('image', 'fileName', '.png', 'local');
    expect(s3.s3Client.upload).toHaveBeenCalledTimes(1);
  });

  it('when I call uploadBase64 and have some error then should throw an exception', async () => {
    const s3Client = {
      upload: jest.fn(() => { throw new Error('Some error'); }),
    };

    const s3 = new S3Implementation(s3Client);
    try {
      await s3.uploadBase64('image', 'fileName', '.png', 'local');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });
});
