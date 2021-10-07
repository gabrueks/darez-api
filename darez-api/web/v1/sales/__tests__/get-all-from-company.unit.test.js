const { findAllFromCompany } = require('../findAllFromCompany');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanySales: {
      findAll: jest.fn(),
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

const findAllResponse = [{
  client_id: 1,
  price: 10.00,
  description: 'description',
  sale_time: '2010-10-10 10:10:100Z',
  payment_method: 'DINHEIRO',
}];

describe('Unit Test: sales/findAllFromCompany', () => {
  it('when I use findAllFromCompany should return all sales information from company', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => findAllResponse);

    const response = await findAllFromCompany({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 200,
      data: findAllResponse,
    });

    mockSave.mockRestore();
  });

  it('when I use findAllFromCompany with some error should return error status', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findAllFromCompany({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
