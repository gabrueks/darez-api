const axios = require('axios');
const { updateStatus } = require('../updateStatus');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Order: {
      findAll: jest.fn(),
      update: jest.fn(),
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
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
}));

const databaseReturnedData = {
  id: 1,
  company_id: 1,
  buyer: 2,
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
  created_at: 'data created',
  updated_at: 'date updated',
};

describe('Unit Test: orders/updateStatus', () => {
  it('when I call updateStatus should update an order status and return success', async () => {
    const mockSave = database.Order.findAll.mockImplementation(
      () => [databaseReturnedData],
    );
    const mockSaveFindBuyer = database.Order.findOne.mockImplementation(
      () => ({ buyer: 1 }),
    );
    const response = await updateStatus({ body: { status: 'New Status' }, params: { ID: '0' }, userId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
    mockSaveFindBuyer.mockRestore();
  });

  it('when I call updateStatus with status canceled with normal payment should update order and return success', async () => {
    const mockSaveOrder = database.Order.findOne.mockImplementation(
      () => ({ company_id: 1, asaas_id: null }),
    );
    const response = await updateStatus({ body: { status: 'Cancelado' }, params: { ID: '0' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSaveOrder.mockRestore();
  });

  it('when I call updateStatus with status canceled with online payment should update order and return success', async () => {
    const mockSaveOrder = database.Order.findOne.mockImplementation(
      () => ({ company_id: 1, asaas_id: 'asaas_id' }),
    );
    const mockSaveCompany = database.Company.findOne.mockImplementation(
      () => ({ asaas_account_key: 'asaas_account_key' }),
    );
    const mockSaveAxios = axios.post.mockImplementation(() => ({ data: { status: 'REFUNDED' } }));
    const response = await updateStatus({ body: { status: 'Cancelado' }, params: { ID: '0' } });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSaveOrder.mockRestore();
    mockSaveCompany.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('when I call updateStatus with a userId equal of buyer and a status Entregue should update an order status and return success', async () => {
    const mockSave = database.Order.findAll.mockImplementation(
      () => [databaseReturnedData],
    );
    const mockSaveFindBuyer = database.Order.findOne.mockImplementation(
      () => ({ buyer: 1 }),
    );
    const response = await updateStatus({ body: { status: 'Entregue' }, params: { ID: '0' }, userId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
    mockSaveFindBuyer.mockRestore();
  });

  it('when I call updateStatus with any Id or Status but no results are found should return updated', async () => {
    const mockSave = database.Order.findAll.mockImplementation(
      () => [],
    );
    const mockSaveFindBuyer = database.Order.findOne.mockImplementation(
      () => ({ buyer: 1 }),
    );
    const response = await updateStatus({ body: { status: 'Cancelado' }, params: { ID: '0' }, userId: 1 });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
    mockSaveFindBuyer.mockRestore();
  });

  it('when I call updateStatus with some error should return a status of error', async () => {
    const mockSave = database.Order.update.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveFindBuyer = database.Order.findOne.mockImplementation(
      () => ({ buyer: 1 }),
    );

    const response = await updateStatus({ body: { status: 'New Status' }, params: { ID: '0' }, userId: 1 });
    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
    mockSaveFindBuyer.mockRestore();
  });
});
