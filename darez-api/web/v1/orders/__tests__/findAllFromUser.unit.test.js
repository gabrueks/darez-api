process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findAllFromUser } = require('../findAllFromUser');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Order: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnedDataAll = [{
  id: 1,
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
  change: 0.00,
  created_at: '2020-10-01T14:24:45.000Z',
  updated_at: '2020-10-01T14:24:45.000Z',
  Company: {
    fantasy_name: 'company name',
  },
  OrderProducts: [
    {
      dataValues: {
        id: 1,
        quantity: 1,
        name: 'nome',
        description: 'descricao',
        category: 'categoria',
        subcategory: 'subcategoria',
        product_id: 1,
        product_variation_id: 1,
        color: 'vermelho',
        size: 'pp',
        Product: {
          ProductPhotos: [{ photo_key: 'photo_key' }],
        },
      },
    },
  ],
}];

const databaseExpectedDataAll = [{
  id: 1,
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
  change: 0.00,
  company: 'company name',
  created_at: '2020-10-01T14:24:45.000Z',
  updated_at: '2020-10-01T14:24:45.000Z',
  order_products: [
    {
      id: 1,
      quantity: 1,
      name: 'nome',
      description: 'descricao',
      category: 'categoria',
      subcategory: 'subcategoria',
      product_id: 1,
      product_variation_id: 1,
      color: 'vermelho',
      size: 'pp',
      photo_key: 'photo_key',
    },
  ],
}];

describe('Unit Test: orders/findAllFromUser', () => {
  it('when I call findAllFromUser with params.ID (admin) should return all orders from user', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => databaseReturnedDataAll);

    const response = await findAllFromUser(
      { query: { page: 0, pageSize: 1 }, params: { ID: 1 }, userId: null },
    );

    expect(response).toEqual({
      statusCode: 200,
      data: {
        orders: databaseExpectedDataAll,
        bucket_url: 'https://s3host.teste.com/',
      },
    });

    mockSave.mockRestore();
  });

  it('when I call findAllFromUser with no params.ID should return all orders from user', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => databaseReturnedDataAll);

    const response = await findAllFromUser(
      { query: { page: 0, pageSize: 1 }, params: {}, userId: 1 },
    );

    expect(response).toEqual({
      statusCode: 200,
      data: {
        orders: databaseExpectedDataAll,
        bucket_url: 'https://s3host.teste.com/',
      },
    });

    mockSave.mockRestore();
  });

  it('when I call findAllFromUser with some error should return a status of error', async () => {
    const mockSave = database.Order.findAll.mockImplementation(
      () => { throw new Error('Some error'); },
    );

    const response = await findAllFromUser(
      { query: { page: 0, pageSize: 1 }, params: { ID: 1 }, userId: 1 },
    );

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I call findAllFromUser with date limit should return all orders from an user inside a range', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => [
      {
        id: 'order_id',
        company_id: 10,
        price: '50.00',
        payment_method: 'Dinheiro',
        status: 'Solicitado',
        created_at: '2020-10-28T20:00:45.000Z',
      }]);

    const response = await findAllFromUser(
      { query: { initialDate: '2020-10-11 00:01:00', endDate: '2020-11-11 00:01:00' }, params: { ID: 1 }, userId: null },
    );

    expect(response).toEqual({
      statusCode: 200,
      data: {
        orders: [
          {
            id: 'order_id',
            company_id: 10,
            price: '50.00',
            payment_method: 'Dinheiro',
            status: 'Solicitado',
            created_at: '2020-10-28T20:00:45.000Z',
          }],
      },
    });

    mockSave.mockRestore();
  });

  it('when I call findAllFromUser with only initial date should return all orders of an user', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => databaseReturnedDataAll);

    const response = await findAllFromUser(
      { query: { page: 0, pageSize: 1, initialDate: '2020-10-11 00:01:00' }, params: { ID: 1 }, userId: null },
    );

    expect(response).toEqual({
      statusCode: 200,
      data: {
        orders: databaseExpectedDataAll,
        bucket_url: 'https://s3host.teste.com/',
      },
    });

    mockSave.mockRestore();
  });

  it('when I call findAllFromUser with only end date should return all orders of an user', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => databaseReturnedDataAll);

    const response = await findAllFromUser(
      { query: { page: 0, pageSize: 1, endDate: '2020-10-11 00:01:00' }, params: { ID: 1 }, userId: null },
    );

    expect(response).toEqual({
      statusCode: 200,
      data: {
        orders: databaseExpectedDataAll,
        bucket_url: 'https://s3host.teste.com/',
      },
    });

    mockSave.mockRestore();
  });
});
