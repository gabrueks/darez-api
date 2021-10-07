const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanySales: {
      bulkCreate: jest.fn(),
    },
    Company: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('Unit Test: sales/create', () => {
  it('when I use create should create a new sale to a company', async () => {
    const mockSave = database.CompanySales.bulkCreate.mockImplementation(() => (0));
    const mockSave2 = database.Company.findOne.mockImplementation(() => ({
      fantasy_name: 'Fantasy Name',
      phone_area_code: '11',
      phone_number: '912345678',
      neighborhood: 'Vila Olimpia',
      city: 'São Paulo',
      state: 'SP',
    }));

    const response = await create({
      body: {
        description: 'description',
        price: '10.00',
        client_id: 1,
        payment_method: 'DINHEIRO',
        date: '10/10/2010',
        time: '10:10',
      },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 201,
      data: { },
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I use create should create a new sale to a company when split_times has value', async () => {
    const mockSave = database.CompanySales.bulkCreate.mockImplementation(() => (0));
    const mockSave2 = database.Company.findOne.mockImplementation(() => ({
      fantasy_name: 'Fantasy Name',
      phone_area_code: '11',
      phone_number: '912345678',
      neighborhood: 'Vila Olimpia',
      city: 'São Paulo',
      state: 'SP',
    }));

    const response = await create({
      body: {
        description: 'description',
        price: '10.00',
        client_id: 1,
        payment_method: 'DINHEIRO',
        date: '10/10/2010',
        time: '10:10',
        split_times: 2,
      },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 201,
      data: { },
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I use create with some error should return error status', async () => {
    const mockSave = database.CompanySales.bulkCreate.mockImplementation(() => { throw new Error('Some error'); });

    const response = await create({
      body: {
        description: 'description',
        price: '10.00',
        client_id: 1,
        payment_method: 'DINHEIRO',
        date: '10/10/2010',
        time: '10:10',
      },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
