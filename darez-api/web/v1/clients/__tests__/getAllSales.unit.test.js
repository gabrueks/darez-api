const { getAllSales } = require('../getAllSales');
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

describe('Unit Test: clients/getAllSales', () => {
  it('when I use getAllSales should return all sales from client', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => [{
      id: 1,
      company_id: 1,
      client_id: 1,
      price: 12.00,
      description: 'Description',
    }]);

    const response = await getAllSales({
      companyId: 1,
      params: { ID: 1 },
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        sales: [{
          id: 1,
          company_id: 1,
          client_id: 1,
          price: 12.00,
          description: 'Description',
        }],
      },
    });

    mockSave.mockRestore();
  });

  it('when I use getAllSales with some error should return error status', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await getAllSales({
      companyId: 1,
      params: { ID: 1 },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
