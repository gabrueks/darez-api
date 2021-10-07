const axios = require('axios');
const { createAccount } = require('../createAccount');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findOne: jest.fn(),
      update: jest.fn(),
    },
    CompanyPayment: {
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

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('Unit Test: payments/createAccount', () => {
  it('When I call createAccount of a company that do not have an asaas should create and return success', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({
      fantasy_name: 'Nome Fantasia',
      document: '1234',
      phone_area_code: '11',
      phone_number: '912345678',
      street: 'street',
      street_number: 'street_number',
      address_2: 'address_2',
      neighborhood: 'neighborhood',
      cep: '01234000',
      asaas_account_key: null,
    }));
    const mockSaveAxios = axios.post.mockImplementation(() => ({ data: { apiKey: 'api key', walletId: 'wallet id', object: 'account' } }));

    const response = await createAccount({ companyId: 10 });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('When I call createAccount of a company that already has an asaas account should return a forbidden error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({
      fantasy_name: 'Nome Fantasia',
      document: '1234',
      phone_area_code: '11',
      phone_number: '912345678',
      street: 'street',
      street_number: 'street_number',
      address_2: 'address_2',
      neighborhood: 'neighborhood',
      cep: '01234000',
      asaas_account_key: 'some_asaas_key',
    }));
    const mockSaveAxios = axios.post.mockImplementation(() => ({ data: { apiKey: 'api key', walletId: 'wallet id', object: 'account' } }));

    const response = await createAccount({ companyId: 10 });

    expect(response).toEqual({
      statusCode: 403,
      data: { message: 'Proibido' },
    });

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('When I call createAccount with some error should return error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await createAccount({ companyId: 10 });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
