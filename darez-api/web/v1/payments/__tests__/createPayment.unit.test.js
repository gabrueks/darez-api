const axios = require('axios');
const { createPayment } = require('../createPayment');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Order: {
      findOne: jest.fn(() => ({
        company_id: 10,
        payment_method: 'Cartão de Crédito',
        price: 22.90,
        cep: '01234000',
        street_number: '200',
        address_2: 'apto 20',
      })),
      update: jest.fn(),
    },
    Company: {
      findOne: jest.fn(),
    },
    User: {
      findOne: jest.fn(() => ({
        phone_area_code: '11',
        phone_number: '912345678',
        full_name: 'Nome Completo',
        document: '12345678990',
        id: 1,
      })),
    },
    UserAsaas: {
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

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

const createPaymentBody = {
  order_id: '374d7dc0-f6aa-11ea-9be3-03f0ba041444',
  card_holder: {
    document: '24971563792',
  },
  credit_card: {
    holder_name: 'marcelo h almeida',
    number: '5162306219378829',
    expiry_month: '05',
    expiry_year: '2021',
    ccv: '318',
  },
};

describe('Unit Test: payments/createPayment', () => {
  it('When I call createPayment from a user that is not a client of the account should create user and payment', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ asaas_account_key: 'asaas_id' }));
    const mockSaveUserAsaas = database.UserAsaas.findOne.mockImplementation(() => null);
    const mockSaveAxios = axios.post
      .mockImplementationOnce(() => ({
        data: {
          id: 'asaas_id',
          dateCreated: '2020-01-01',
          object: 'client',
        },
      }))
      .mockImplementationOnce(() => ({
        data: {
          object: 'payment',
          id: 'pay_id',
          status: 'CONFIRMADO',
          invoiceUrl: 'invoice_url',
          bankSlipUrl: 'bank_slip_url',
          netValue: 21.75,
          invoiceNumber: '123456789098',
        },
      }));

    const response = await createPayment({
      userId: 1,
      body: createPaymentBody,
    });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });
    expect(axios.post).toHaveBeenCalledTimes(2);

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
    mockSaveUserAsaas.mockRestore();
  });

  it('When I call createPayment from a user that is a client of the account, should create just payment', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ asaas_account_key: 'asaas_id' }));
    const mockSaveUserAsaas = database.UserAsaas.findOne.mockImplementation(() => ({ asaas_id: 'asaas_id' }));
    const mockSaveAxios = axios.post.mockImplementationOnce(() => ({
      data: {
        object: 'payment',
        id: 'pay_id',
        status: 'CONFIRMADO',
        invoiceUrl: 'invoice_url',
        bankSlipUrl: 'bank_slip_url',
        netValue: 21.75,
        invoiceNumber: '123456789098',
      },
    }));

    const response = await createPayment({
      userId: 1,
      body: createPaymentBody,
    });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });
    expect(axios.post).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
    mockSaveUserAsaas.mockRestore();
  });

  it('When I call createPayment with some error should return error', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await createPayment({
      userId: 1,
      body: createPaymentBody,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
