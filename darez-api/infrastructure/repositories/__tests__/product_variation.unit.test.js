const ProductVariationRepository = require('../product_variation');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
    },
    ProductVariation: {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

const databaseReturnedData = {
  id: 1,
  product_id: 1,
  color: 'some color',
  size: 'some size',
};

describe('Unit Test: ProductVariationRepository', () => {
  it('when I call create then should create a product variation and return his data', async () => {
    const mockSave = database.ProductVariation.create.mockImplementation(() => (
      databaseReturnedData));

    const productVariationRepository = new ProductVariationRepository(database);
    const productVariation = await productVariationRepository.create({
      product_id: 1,
      color: 'some color',
      size: 'some size',
    });

    expect(productVariation).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductVariation.create.mockImplementation(() => { throw new Error('Some error'); });

    const productVariationRepository = new ProductVariationRepository(database);

    try {
      await productVariationRepository.create({
        product_id: 1,
        color: 'some color',
        size: 'some size',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOne should return specific attributes from a specific product variation', async () => {
    const mockSave = database.ProductVariation.findOne.mockImplementation(() => (
      databaseReturnedData));

    const productVariationRepository = new ProductVariationRepository(database);
    const result = await productVariationRepository.findOne(['id', 'product_id', 'color', 'size'], 1);
    expect(result).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductVariation.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const productVariationRepository = new ProductVariationRepository(database);
    try {
      await productVariationRepository.findOne(['id', 'product_id', 'color', 'size'], 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update all informations from a specific product variation', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => [1]);

    const productVariationRepository = new ProductVariationRepository(database);
    const result = await productVariationRepository.update(1,
      {
        product_id: 1,
        color: 'some color',
        size: 'some size',
      });

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => { throw new Error('Some error'); });

    const productVariationRepository = new ProductVariationRepository(database);
    try {
      await productVariationRepository.update(1,
        {
          product_id: 1,
          color: 'some color',
          size: 'some size',
        });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call logicalDelete should inactivate all variations from an specific product', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => [1]);

    const productVariationRepository = new ProductVariationRepository(database);
    const result = await productVariationRepository.logicalDelete(1, 'data');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call logicalDelete and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => { throw new Error('Some error'); });

    const productVariationRepository = new ProductVariationRepository(database);
    try {
      await productVariationRepository.logicalDelete(1, 'data');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findProductVariations should return all variations from an specific product', async () => {
    const mockSave = database.ProductVariation.findAll.mockImplementation(() => [{ color: 'b', size: '22' }]);

    const productVariationRepository = new ProductVariationRepository(database);
    const result = await productVariationRepository.findProductVariations(['color', 'size'], 1);

    expect(result).toEqual([{ color: 'b', size: '22' }]);
    mockSave.mockRestore();
  });

  it('when I call findProductVariations and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductVariation.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const productVariationRepository = new ProductVariationRepository(database);
    try {
      await productVariationRepository.findProductVariations(['color', 'size'], 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call deleteMany should inactivate all variations in the given list', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => [1]);

    const productVariationRepository = new ProductVariationRepository(database);
    const result = await productVariationRepository.deleteMany([1], 1, 'data');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call deleteMany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.ProductVariation.update.mockImplementation(() => { throw new Error('Some error'); });

    const productVariationRepository = new ProductVariationRepository(database);
    try {
      await productVariationRepository.deleteMany(1, 'data');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
