const ProductRepository = require('../product');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Product: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      max: jest.fn(),
    },
  },
}));

const databaseReturnedData = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  'ProductPhotos.photo_key': 'product_photo_url',
};

const databaseReturnedDataFinds = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  'Promotion.id': 1,
  'Promotion.created_by': 'Name',
  'Promotion.date_start': 'startDate',
  'Promotion.date_end': 'endDate',
  'Promotion.discount': 10,
  'Promotion.has_limit_date': 1,
};

const databaseReturnedDataFindAll = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  'ProductPhotos.photo_key': 'product_photo_url',
  'Promotion.id': 1,
  'Promotion.created_by': 'Name',
  'Promotion.date_start': 'startDate',
  'Promotion.date_end': 'endDate',
  'Promotion.discount': 10,
  'Promotion.has_limit_date': 1,
};

const databaseReturnedDataFindPreferences = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  ProductPhotos: [{ photo_key: 'product_photo_url' }],
  Company: {
    dataValues: {
      distance: 1,
      endpoint: 'endpoint',
    },
  },
  Promotion: {
    id: 1,
    created_by: 'Name',
    date_start: 'startDate',
    date_end: 'endDate',
    discount: 10,
    has_limit_date: 1,
  },
};

const finalResultPreferences = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  photo_key: ['product_photo_url'],
  distance: 1,
  company_endpoint: 'endpoint',
  promotion: {
    id: 1,
    created_by: 'Name',
    date_start: 'startDate',
    date_end: 'endDate',
    discount: 10,
    has_limit_date: 1,
  },
};

const databaseReturnedDataFinalFindAll = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  photo_key: 'product_photo_url',
  promotion_id: 1,
  promotion_created_by: 'Name',
  promotion_date_start: 'startDate',
  promotion_date_end: 'endDate',
  promotion_discount: 10,
  promotion_has_limit_date: 1,
};

const databaseReturnedDataFinal = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  promotion_id: 1,
  promotion_created_by: 'Name',
  promotion_date_start: 'startDate',
  promotion_date_end: 'endDate',
  promotion_discount: 10,
  promotion_has_limit_date: 1,
};

const productUpdate = {
  ID: 1,
  name: 'product',
  description: 'description',
  price: 'price',
  category: 'category',
  subcategory: 'subcategory',
};

describe('Unit Test: ProductRepository', () => {
  it('when I call create then should create a product and return his data', async () => {
    const mockSave = database.Product.create.mockImplementation(() => databaseReturnedData);

    const productRepository = new ProductRepository(database);
    const product = await productRepository.create({
      company_id: 1,
      name: 'product name',
      description: 'some description',
      price: 12.99,
      promotion_price: 10.0,
      category: 'some category',
      subcategory: 'some subcategory',
    });

    expect(product).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.create
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);

    try {
      await productRepository.create({
        company_id: 1,
        name: 'product name',
        description: 'some description',
        price: 12.99,
        promotion_price: 10.0,
        category: 'some category',
        subcategory: 'some subcategory',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOne should return specific attributes from a specific product', async () => {
    const mockSave = database.Product.findOne.mockImplementation(() => databaseReturnedDataFinds);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findOne(null, 1);

    expect(result).toEqual(databaseReturnedDataFinal);
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findOne.mockImplementation(() => {
      throw new Error('Some error');
    });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.findOne(null, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany should return all active products from a specific company', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => [databaseReturnedDataFindAll]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findAllFromCompany(1);

    expect(result).toEqual([databaseReturnedDataFinalFindAll]);
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.findAllFromCompany(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllPreferences should return all active products in especific category and region', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => [databaseReturnedDataFindPreferences]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findAllPreferences(
      1,
      'date',
      { lat: 1, lng: 1 },
      0,
      1,
    );

    expect(result).toEqual([finalResultPreferences]);
    mockSave.mockRestore();
  });

  it('when I call findAllPreferences and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.findAllPreferences(1, 'date', { lat: 1, lng: 1 });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllProductsFromCategoryCompany should return all active products from a specific company', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [databaseReturnedData]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findAllProductsFromCategoryCompany(
      1,
      'category',
    );

    expect(result).toEqual([
      {
        id: 1,
        company_id: 1,
        name: 'product name',
        description: 'some description',
        price: 12.99,
        promotion_price: 10.0,
        category: 'some category',
        subcategory: 'some subcategory',
        photo_key: 'product_photo_url',
      },
    ]);
    mockSave.mockRestore();
  });

  it('when I call findAllProductsFromCategoryCompany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.findAllProductsFromCategoryCompany(1, 'category');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update all informations from a specific product', async () => {
    const mockSave = database.Product.update.mockImplementation(() => [1]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.update(1, productUpdate);

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.update
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.update(1, productUpdate);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call logicalDelete should inactivate a product', async () => {
    const mockSave = database.Product.update.mockImplementation(() => [1]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.logicalDelete([1, 2], 'date');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call logicalDelete and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.update
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.logicalDelete([1, 2], 'date');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call deletePromotion should delete promotion and promotion_price from product', async () => {
    const mockSave = database.Product.update.mockImplementation(() => [1]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.deletePromotion(1);

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call deletePromotion and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.update
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.deletePromotion(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findProductsSubcategory should count products from each subcategory from a company', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [
      { subcategory: 'subcategory1', count_products: 1 },
      { subcategory: 'subcategory2', count_products: 2 },
    ]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findProductsSubcategory(1);

    expect(result).toEqual([
      { subcategory: 'subcategory1', count_products: 1 },
      { subcategory: 'subcategory2', count_products: 2 },
    ]);
    mockSave.mockRestore();
  });

  it('when I call findProductsSubcategory and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => { throw new Error('Some error'); });
    const productRepository = new ProductRepository(database);

    try {
      await productRepository.findProductsSubcategory(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call topCategory should return teh category with most products from company', async () => {
    const mockSave = database.Product.findOne.mockImplementation(() => ({ category: 'category' }));

    const productRepository = new ProductRepository(database);
    const result = await productRepository.topCategory(1);

    expect(result).toEqual('category');
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findOne
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.topCategory(1, productUpdate);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findProductToSort should return the products that will be sort it', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [{ id: 1 }, { id: 2 }]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findProductToSort(1, 2, 4, 1);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    mockSave.mockRestore();
  });

  it('when I call findProductToSort and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Product.findAll
      .mockImplementation(() => { throw new Error('Some error'); });

    const productRepository = new ProductRepository(database);
    try {
      await productRepository.findProductToSort({});
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call updateSumSubSort should update all sorting changed', async () => {
    const mockSave = database.Product.update.mockImplementation(() => [1]);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.updateSumSubSort([1, 2, 3], 1);

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call findLastSort should return the max sort_id found it', async () => {
    const mockSave = database.Product.max.mockImplementation(() => 2);

    const productRepository = new ProductRepository(database);
    const result = await productRepository.findLastSort(1);

    expect(result).toEqual(2);
    mockSave.mockRestore();
  });
});
