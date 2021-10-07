const axios = require('axios');
const { checkBalance } = require('../checkBalance');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findOne: jest.fn(),
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

describe('Unit Test: payments/checkBalance', () => {
  it('When I call checkBalance should return the balance of an asaas account', async () => {
    const mockSave = axios.get.mockImplementation(() => ({ data: { totalBalance: 20.00 } }));
    const mockSaveCompany = database.Company.findOne.mockImplementation(() => ({ asaas_account_key: 'account_key' }));

    const response = await checkBalance({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 200,
      data: { balance: 20.00 },
    });
    expect(axios.get).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
    mockSaveCompany.mockRestore();
  });

  it('When I call checkBalance from a company that is not on asaas should return forbidenn', async () => {
    const mockSave = axios.get.mockImplementation(() => ({ data: { totalBalance: 20.00 } }));
    const mockSaveCompany = database.Company.findOne.mockImplementation(() => ({}));

    const response = await checkBalance({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 403,
      data: { message: 'Proibido' },
    });
    expect(axios.get).toHaveBeenCalledTimes(0);

    mockSave.mockRestore();
    mockSaveCompany.mockRestore();
  });

  it('When I call checkBalance with some error should return error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await checkBalance({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    expect(axios.get).toHaveBeenCalledTimes(0);

    mockSave.mockRestore();
  });
});
