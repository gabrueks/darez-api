const { findAllDateRange } = require('../findAllDateRange');
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

const findAllDateResponse = [{
  client_id: 1,
  price: 10.00,
  description: 'description',
  sale_time: '2010-10-10 10:10:100Z',
  payment_method: 'DINHEIRO',
}];

describe('Unit Test: sales/findAllFromCompany', () => {
  it('when I use findAllDateRange should return all sales information from company in date range', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => findAllDateResponse);

    const response = await findAllDateRange({
      companyId: 1,
      query: { start: '10/10/2010', end: '10/10/2010' },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: findAllDateResponse,
    });

    mockSave.mockRestore();
  });

  it('when I use findAllDateRange with some error should return error status', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findAllDateRange({
      companyId: 1,
      query: { start: '10/10/2010', end: '10/10/2010' },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
