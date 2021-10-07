const ProductPhotoRepository = require('../product_photo');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    ProductPhoto: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      destroy: jest.fn(),
      findOne: jest.fn(),
    },
    Product: {
      findAll: jest.fn(),
    },
  },
}));

const databaseReturnedData = {
  id: 1,
  product_id: 1,
  photo_key: 'photo/key',
};

describe('Unit Test: ProductPhotoRepository', () => {
  it('when I call create then should create a product photo and return his data', async () => {
    const mockSave = database.ProductPhoto.create.mockImplementation(() => (databaseReturnedData));

    const productPhotoRepository = new ProductPhotoRepository(database);
    const productPhoto = await productPhotoRepository.create({
      product_id: 1,
      photo_key: 'photo/key',
    });

    expect(productPhoto).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.create.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);

    try {
      await productPhotoRepository.create({
        product_id: 1,
        photo_key: 'photo/key',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update then should update a product photo and return his data', async () => {
    const mockSave = database.ProductPhoto.update.mockImplementation(() => ({ is_main: true }));

    const productPhotoRepository = new ProductPhotoRepository(database);
    const result = await productPhotoRepository.update(1, { is_main: true });

    expect(result).toEqual({ is_main: true });
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.update.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);

    try {
      await productPhotoRepository.update(1, { is_main: true });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
  });

  it('when I call findPhotos should return all photos of a specific product', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => (databaseReturnedData));

    const productPhotoRepository = new ProductPhotoRepository(database);
    const r3 = await productPhotoRepository.findPhotos(1);
    expect(r3).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call findPhotos and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);
    try {
      await productPhotoRepository.findPhotos(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllById should return all photos of a specific product given a range of photos ids', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => [{ product_key: 'url' }]);

    const productPhotoRepository = new ProductPhotoRepository(database);
    const result = await productPhotoRepository.findAllById(['product_key'], [1], 1);

    expect(result).toEqual([{ product_key: 'url' }]);
    mockSave.mockRestore();
  });

  it('when I call findAllById and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);
    try {
      await productPhotoRepository.findAllById(['product_key'], [1], 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call deleteMany should delete a specific photo', async () => {
    const mockSave = database.ProductPhoto.destroy.mockImplementation(() => [1]);

    const productPhotoRepository = new ProductPhotoRepository(database);
    const result = await productPhotoRepository.deleteMany(1, 1);

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call deleteMany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.destroy.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);
    try {
      await productPhotoRepository.deleteMany(1, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call logicalDelete should inactivate all photos from an specific product', async () => {
    const mockSave = database.ProductPhoto.update.mockImplementation(() => [1]);

    const productPhotoRepository = new ProductPhotoRepository(database);
    const result = await productPhotoRepository.logicalDelete(1, 'date');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call logicalDelete and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.update.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);
    try {
      await productPhotoRepository.logicalDelete(1, 'date');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findMainOfProduct then should return a data of specific image', async () => {
    const mockSave = database.ProductPhoto.findOne.mockImplementation(() => ({ id: 1 }));

    const productPhotoRepository = new ProductPhotoRepository(database);
    const result = await productPhotoRepository.findMainOfProduct(['id'], 1);

    expect(result).toEqual({ id: 1 });
    mockSave.mockRestore();
  });

  it('when I call findMainOfProduct and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductPhoto.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);

    try {
      await productPhotoRepository.findMainOfProduct(['id'], 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
  });

  it('when I call findAllMainFromCompany should return all main images of a company', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [{ 'ProductPhotos.product_id': 1, 'ProductPhotos.photo_key': 'photo_key' }]);

    const productPhotoRepository = new ProductPhotoRepository(database);

    const result = await productPhotoRepository.findAllMainFromCompany(1);
    expect(result).toEqual({ 1: 'photo_key' });

    mockSave.mockRestore();
  });

  it('when I call findAllMainFromCompany from company that does not has any main image should return empty array', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => []);

    const productPhotoRepository = new ProductPhotoRepository(database);

    const result = await productPhotoRepository.findAllMainFromCompany(1);
    expect(result).toEqual({});

    mockSave.mockRestore();
  });

  it('when I call findAllMainFromCompany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const productPhotoRepository = new ProductPhotoRepository(database);

    try {
      await productPhotoRepository.findAllMainFromCompany(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
  });
});
