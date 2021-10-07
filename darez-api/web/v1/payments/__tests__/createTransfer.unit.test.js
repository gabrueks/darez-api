const axios = require('axios');
const { createTransfer } = require('../createTransfer');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findOne: jest.fn(),
    },
    AsaasTransferData: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
}));

const createTransferAxiosResponse = {
  data: {
    asaas_id: 'asaas_id',
    asaas_created_at: '2020-10-07',
    asaas_object: 'transfer',
    value: 10.89,
    net_value: 10.89,
    asaas_status: 'PENDING',
    asaas_transfer_fee: 5,
    asaas_transaction_receipt_url: null,
    asaas_schedule_date: '2020-10-08',
    asaas_authorized: true,
  },
};

const createTransferBody = {
  value: 500000,
  bank_code: '033',
  owner_name: 'Marcelo Almeida',
  document: '78014832000',
  agency: '1263',
  account: '9999991',
  account_digit: '1',
  account_type: 'CONTA_CORRENTE',
};

describe('Unit Test: payments/createTransfer', () => {
  it('When I call createTransfer from a company that has asaas account should create normally', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ asaas_account_key: 'asaas_account_key' }));
    const mockSaveAxios = axios.post.mockImplementation(() => createTransferAxiosResponse);

    const response = await createTransfer({ companyId: 10, body: createTransferBody });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('When I call createTransfer from a company that do not have asaas account should return forbidden message', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({
      asaas_account_key: null,
    }));
    const mockSaveAxios = axios.post.mockImplementation(() => createTransferAxiosResponse);

    const response = await createTransfer({ companyId: 10, body: createTransferBody });

    expect(response).toEqual({
      statusCode: 403,
      data: { message: 'Proibido' },
    });

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('When I call createTransfer with a value bigger than the available should return unavailble message', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ asaas_account_key: 'asaas_account_key' }));
    /* eslint-disable */
    const mockSaveAxios = axios.post.mockImplementation(() => {
      throw ({
        response: {
          status: 400,
          data: {
            errors: [{
              code: 'invalid_action',
            }],
          }
        }
      });
    });
    /* eslint-enable */

    const response = await createTransfer({ companyId: 10, body: createTransferBody });

    expect(response).toEqual({
      statusCode: 400,
      data: { message: 'Saldo insuficiente' },
    });

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('When I call createTransfer with some error should return error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await createTransfer({ companyId: 10, body: createTransferBody });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
