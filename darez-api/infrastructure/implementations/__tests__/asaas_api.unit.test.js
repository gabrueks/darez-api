const axios = require('axios');
const Boom = require('@hapi/boom');
const asaas = require('../asaas_api');

jest.mock('axios', () => ({
  post: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
}));

jest.mock('@hapi/boom', () => ({
  internal: jest.fn(),
}));

const createTransferResponse = {
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

describe('Unit Test: Asaas Implementation', () => {
  it('when I call create_account should call axios post once and return the response data', async () => {
    const mockSave = axios.post.mockImplementation(() => ({ data: { apiKey: 'apiKey', walletId: 'walletId', object: 'asaasObject' } }));

    const response = await asaas.createAccount('asaasKey', 'name', 'email@mail.com', '12345678900',
      '11 12345678', 'address', 'addressNumber', 'complement', 'province', 'postalCode', 'companyType');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ apiKey: 'apiKey', walletId: 'walletId', object: 'asaasObject' });

    mockSave.mockRestore();
  });

  it('when I call create_account with some erro should not work', async () => {
    const mockSave = axios.post.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveBoom = Boom.internal.mockImplementation(() => { throw new Error('Some error'); });

    try {
      await asaas.createAccount('asaasKey', 'name', 'email@mail.com', '12345678900',
        '11 12345678', 'address', 'addressNumber', 'complement', 'province', 'postalCode', 'companyType');
    } catch (err) {
      expect(Boom.internal).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
    mockSaveBoom.mockRestore();
  });

  it('when I call create_client should call axios post once and return the response data', async () => {
    const mockSave = axios.post.mockImplementation(() => ({ data: { id: 'asaasId', dateCreated: '2020-01-01', object: 'asaasObject' } }));

    const response = await asaas.createClient('assasApiKey', 'name', '11 912345678', '12345678900', 'internalId');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ id: 'asaasId', dateCreated: '2020-01-01', object: 'asaasObject' });

    mockSave.mockRestore();
  });

  it('when I call create_client with some erro should not work', async () => {
    const mockSave = axios.post.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveBoom = Boom.internal.mockImplementation(() => { throw new Error('Some error'); });

    try {
      await asaas.createClient('assasApiKey', 'name', '11 912345678', '12345678900', 'internalId');
    } catch (err) {
      expect(Boom.internal).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
    mockSaveBoom.mockRestore();
  });

  it('when I call create_payment should call axios post once and return the response data', async () => {
    const mockSave = axios.post.mockImplementation(() => ({
      data: {
        id: 'asaasId',
        status: 'CONFIRMADO',
        object: 'asaasObject',
        invoiceUrl: 'invoiceUrl',
        bankSlipUrl: 'bankSlipUrl',
        netValue: 19.74,
        invoiceNumber: '123456789098',
      },
    }));

    const response = await asaas.createPayment('assasApiKey', 'cus_id', 'CREDIT_CARD', 20, '2020-01-01', 'internalId', {
      holderName: 'holder name',
      number: '1234 5678 9012 3456',
      expiryMonth: '05',
      expiryYear: '2021',
      ccv: '123',
    },
    {
      name: 'holder name',
      email: 'email@mail.com',
      cpfCnpj: '12345678900',
      phone: '11 12345678',
      postalCode: '01234567',
      addressNumber: '200',
      addressComplement: 'apto 1-',
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      id: 'asaasId',
      status: 'CONFIRMADO',
      object: 'asaasObject',
      invoiceUrl: 'invoiceUrl',
      bankSlipUrl: 'bankSlipUrl',
      netValue: 19.74,
      invoiceNumber: '123456789098',
    });

    mockSave.mockRestore();
  });

  it('when I call create_payment with some erro should not work', async () => {
    const mockSave = axios.post.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveBoom = Boom.internal.mockImplementation(() => { throw new Error('Some error'); });

    try {
      await asaas.createPayment('assasApiKey', 'cus_id', 'CREDIT_CARD', 20, '2020-01-01', 'internalId', {
        holderName: 'holder name',
        number: '1234 5678 9012 3456',
        expiryMonth: '05',
        expiryYear: '2021',
        ccv: '123',
      },
      {
        name: 'holder name',
        email: 'email@mail.com',
        cpfCnpj: '12345678900',
        phone: '11 12345678',
        postalCode: '01234567',
        addressNumber: '200',
        addressComplement: 'apto 1-',
      });
    } catch (err) {
      expect(Boom.internal).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
    mockSaveBoom.mockRestore();
  });

  it('when I call refund_payment should call axios post once and return the response data', async () => {
    const mockSave = axios.post.mockImplementation(() => ({ data: { status: 'REFUNDED' } }));

    const response = await asaas.refundPayment('assasApiKey', 'payment_id');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ status: 'REFUNDED' });

    mockSave.mockRestore();
  });

  it('when I call refund_payment with some erro should not work', async () => {
    const mockSave = axios.post.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveBoom = Boom.internal.mockImplementation(() => { throw new Error('Some error'); });

    try {
      await asaas.refundPayment('assasApiKey', 'payment_id');
    } catch (err) {
      expect(Boom.internal).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
    mockSaveBoom.mockRestore();
  });

  it('when I call check_balance should return a balance from an asaas account', async () => {
    const mockSave = axios.get.mockImplementation(() => ({ data: { totalBalance: 20.00 } }));

    const response = await asaas.checkBalance('assasApiKey');

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ totalBalance: 20.00 });

    mockSave.mockRestore();
  });

  it('when I call check_balance with some erro should not work', async () => {
    const mockSave = axios.get.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveBoom = Boom.internal.mockImplementation(() => { throw new Error('Some error'); });

    try {
      await asaas.checkBalance('assasApiKey');
    } catch (err) {
      expect(Boom.internal).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
    mockSaveBoom.mockRestore();
  });

  it('when I call create_transfer should call axios post once and return the response data', async () => {
    const mockSave = axios.post.mockImplementation(() => (createTransferResponse));

    const response = await asaas.createTransfer('assasApiKey', 10.89, 'code', 'ownerName', 'cpfCnpj',
      'agency', 'account', 'accountDigit', 'bankAccountType');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ ...createTransferResponse.data });

    mockSave.mockRestore();
  });

  it('when I call create_transfer and the value is bigger than the available should return a specific message of error', async () => {
    /* eslint-disable */
    const mockSave = axios.post.mockImplementation(() => {
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

    try {
      await asaas.createTransfer('assasApiKey', 10.89, 'code', 'ownerName', 'cpfCnpj',
        'agency', 'account', 'accountDigit', 'bankAccountType');
    } catch (err) {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Saldo insuficiente'));
      expect(Boom.internal).toHaveBeenCalledTimes(0);
    }

    mockSave.mockRestore();
  });

  it('when I call create_transfer with some error should not work', async () => {
    const mockSave = axios.post.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveBoom = Boom.internal.mockImplementation(() => { throw new Error('Some error'); });

    try {
      await asaas.createTransfer('assasApiKey', 10.89, 'code', 'ownerName', 'cpfCnpj',
        'agency', 'account', 'accountDigit', 'bankAccountType');
    } catch (err) {
      expect(Boom.internal).toHaveBeenCalledTimes(1);
      expect(err).toEqual(new Error('Some error'));
    }

    mockSave.mockRestore();
    mockSaveBoom.mockRestore();
  });
});
