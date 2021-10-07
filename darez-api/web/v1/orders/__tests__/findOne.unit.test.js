process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findOne } = require('../findOne');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      col: jest.fn(),
      fn: jest.fn(),
    },
    Order: {
      findOne: jest.fn(),
    },
    OrderProduct: {
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
    Company: {
      findOne: jest.fn(() => ({
        dataValues: {
          User: {
            phone_country_code: '55',
            phone_area_code: '11',
            phone_number: '123456789',
          },
        },
      })),
    },
    User: {
      findOne: jest.fn(() => ({ full_name: 'User Name', phone_area_code: '11', phone_number: '912345678' })),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnedDataProducts = {
  buyer: 2,
  company_id: 1,
  state: 'state',
  city: 'city',
  street: 'street',
  street_number: 0,
  address_2: 'address2',
  cep: '00000000',
  neighborhood: 'neighborhood',
  payment_method: 'credit',
  price: 100,
  status: 'created',
  active: 1,
};

const databaseReturnedDataCount = {
  buyer: 2,
  company_id: 1,
  state: 'state',
  city: 'city',
  street: 'street',
  street_number: 0,
  address_2: 'address2',
  cep: '00000000',
  neighborhood: 'neighborhood',
  payment_method: 'credit',
  price: 100,
  status: 'created',
  active: 1,
  count_products: 1,
  bucket_url: 'https://s3host.teste.com/',
  order_products: [
    {
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
    },
  ],
  buyer_info: [
    {
      full_name: 'nome',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '123456789',
    },
  ],
  company_info: [
    {
      fantasy_name: 'nome da empresa',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '123456789',
    },
  ],
};

describe('Unit Test: orders/findOne', () => {
  it('when I call findOne should return order information and products quantity', async () => {
    const mockSave = database.Order.findOne.mockImplementation(
      () => databaseReturnedDataProducts,
    );
    const mockSaveCount = database.OrderProduct.findOne.mockImplementation(() => (
      { count_products: 1 }));

    const mockSaveProd = database.OrderProduct.findAll.mockImplementation(() => [{
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

    const mockSaveBuyer = database.User.findOne.mockImplementation(() => [{
      full_name: 'nome',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '123456789',
    }]);
    const mockSaveCompany = database.Company.findOne.mockImplementation(() => [{
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '123456789',
      fantasy_name: 'nome da empresa',
    }]);

    const response = await findOne(
      { params: { ID: 1 } },
    );

    expect(response).toEqual({
      statusCode: 200,
      data: databaseReturnedDataCount,
    });

    mockSave.mockRestore();
    mockSaveCount.mockRestore();
    mockSaveProd.mockRestore();
    mockSaveBuyer.mockRestore();
    mockSaveCompany.mockRestore();
  });

  it('when I call findOne with an order id that does not exists should return an error with specific message', async () => {
    const mockSave = database.Order.findOne.mockImplementation(() => null);

    const response = await findOne(
      { params: { ID: 1 } },
    );

    expect(response).toEqual({
      statusCode: 400,
      data: { message: 'Inválido' },
    });

    mockSave.mockRestore();
  });

  it('when I call findOne with some error should return a status of error', async () => {
    const mockSave = database.Order.findOne.mockImplementation(
      () => { throw new Error('Some error'); },
    );
    const response = await findOne(
      { params: { ID: 1 } },
    );

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
