const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Order: {
      create: jest.fn(() => ({ dataValues: 1 })),
    },
    ProductVariation: {
      findOne: jest.fn(),
    },
    Product: {
      findOne: jest.fn(),
    },
    OrderProduct: {
      bulkCreate: jest.fn(),
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
    UserAddresses: {
      create: jest.fn(),
      findOne: jest.fn(),
    },
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

jest.mock('../../../../infrastructure/adapters/maps', () => ({
  geocoder: {
    geocode: jest.fn(() => ([{ latitude: 1, longitude: 2 }])),
  },
}));

const request = {
  body: {
    company_id: 1,
    address: {
      cep: '012345670',
      state: 'SP',
      city: 'São Paulo',
      street: 'Rua da Entrega',
      street_number: 123,
      address_2: 'apto 2',
      neighborhood: 'Bairro',
    },
    payment_method: 'Crédito',
    total_price: 100,
    products: [
      {
        product_id: 1,
        variation_id: 2,
        unity_price: 5,
        quantity: 2,
      },
      {
        product_id: 2,
        unity_price: 7,
        quantity: 3,
      },
    ],
  },
};

const addressResturnd = {
  dataValues: {
    cep: '012345670',
    state: 'SP',
    city: 'São Paulo',
    street: 'Rua da Entrega',
    street_number: 123,
    address_2: 'apto 2',
    neighborhood: 'Bairro',
    latitude: 1,
    longitude: 2,
  },
};

describe('Unit Test: orders/create', () => {
  it('when I call create with available quantity should create a new order', async () => {
    const mockOrderIdSave = database.Order.create.mockImplementation(
      () => ({ dataValues: { id: 'uuid-id' } }),
    );
    const mockFindOneVarSave = database.ProductVariation.findOne.mockImplementation(
      () => ({ dataValues: { color: 'red', size: null } }),
    );
    const mockFindOneSave = database.Product.findOne.mockImplementation(() => ({ dataValues: 10 }));

    const test = database.UserAddresses.create.mockImplementation(() => addressResturnd);

    const mockFindOneUser = database.User.findOne.mockImplementation(() => (
      { full_name: 'User Name', phone_area_code: '11', phone_number: '912345678' }
    ));

    const mockFindOneCompany = database.Company.findOne.mockImplementation(() => (
      {
        dataValues: {
          User: {
            phone_country_code: '55',
            phone_area_code: '11',
            phone_number: '123456789',
          },
        },
      }
    ));

    const response = await create(request);

    expect(response).toEqual({
      statusCode: 201,
      data: { order_id: 'uuid-id' },
    });

    mockOrderIdSave.mockRestore();
    mockFindOneVarSave.mockRestore();
    mockFindOneSave.mockRestore();
    test.mockRestore();
    mockFindOneUser.mockRestore();
    mockFindOneCompany.mockRestore();
  });

  it('when I call create with some error should return a status of error', async () => {
    const mockFindOneVarSave = database.ProductVariation.findOne.mockImplementation(
      () => { throw new Error('Some error'); },
    );
    const mockFindOneSave = database.Product.findOne.mockImplementation(() => ({ dataValues: 1 }));

    const mockFindOneUser = database.User.findOne.mockImplementation(() => (
      { full_name: 'User Name', phone_area_code: '11', phone_number: '912345678' }
    ));

    const mockFindOneCompany = database.Company.findOne.mockImplementation(() => (
      {
        User: {
          phone_country_code: '55',
          phone_area_code: '11',
          phone_number: '123456789',
        },
      }
    ));

    const response = await create(request);

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockFindOneVarSave.mockRestore();
    mockFindOneSave.mockRestore();
    mockFindOneUser.mockRestore();
    mockFindOneCompany.mockRestore();
  });
});
