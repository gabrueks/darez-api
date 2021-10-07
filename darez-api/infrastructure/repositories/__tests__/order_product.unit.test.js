const OrderProductRepository = require('../order_product');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    OrderProduct: {
      bulkCreate: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
    Sequelize: {
      col: jest.fn(),
      fn: jest.fn(),
    },
  },
}));

const databaseReturnedData = {
  User: {
    phone_country_code: '55',
    phone_area_code: '11',
    phone_number: '000000000',
  },
};

describe('Unit Test: Order Product Repository', () => {
  it('when I call create many then should create many product in a order and return it data', async () => {
    const mockSave = database.OrderProduct.bulkCreate.mockImplementation(() => (
      databaseReturnedData));

    const orderProductRepository = new OrderProductRepository(database);
    const result = await orderProductRepository.createMany([]);

    expect(result).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call create many and some exception occurs then should throw an exception', async () => {
    const mockSave = database.OrderProduct.bulkCreate.mockImplementation(() => { throw new Error('Some error'); });

    const orderProductRepository = new OrderProductRepository(database);
    try {
      await orderProductRepository.createMany([]);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call countProducts then should return sum of products from order', async () => {
    const mockSave = database.OrderProduct.findOne.mockImplementation(() => (
      { count_products: 1 }
    ));

    const orderProductRepository = new OrderProductRepository(database);
    const result = await orderProductRepository.countProducts(1);

    expect(result).toEqual(1);
    mockSave.mockRestore();
  });

  it('when I call countProducts and some exception occurs then should throw an exception', async () => {
    const mockSave = database.OrderProduct.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const orderProductRepository = new OrderProductRepository(database);
    try {
      await orderProductRepository.countProducts(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllFromOrder then should return a list of products from an order', async () => {
    const mockSave = database.OrderProduct.findAll.mockImplementation(() => [{
      name: 'name',
      quantity: 1,
      description: 'desc',
      category: 'cat1',
      subcategory: 'sub1',
      product_id: 1,
      product_variation_id: 1,
      unity_price: 1,
      promotion_price: 1,
      Product: {
        ProductPhotos: [
          { photo_key: 'photo_key' },
        ],
      },
    }]);

    const orderProductRepository = new OrderProductRepository(database);
    const result = await orderProductRepository.findAllFromOrder(1);

    expect(result).toEqual([{
      name: 'name',
      quantity: 1,
      description: 'desc',
      category: 'cat1',
      subcategory: 'sub1',
      product_id: 1,
      product_variation_id: 1,
      photo_key: 'photo_key',
      unity_price: 1,
      promotion_price: 1,
    }]);
    mockSave.mockRestore();
  });

  it('when I call findAllFromOrder and some exception occurs then should throw an exception', async () => {
    const mockSave = database.OrderProduct.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const orderProductRepository = new OrderProductRepository(database);
    try {
      await orderProductRepository.findAllFromOrder(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
