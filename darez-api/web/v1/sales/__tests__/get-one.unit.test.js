const { findOne } = require('../findOne');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanySales: {
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

const findOneResponse = {
  client_id: 1,
  price: 10.00,
  description: 'description',
  sale_time: '2010-10-10 10:10:100Z',
  payment_method: 'DINHEIRO',
};

describe('Unit Test: sales/findOne', () => {
  it('when I use findOne should return sales by Id', async () => {
    const mockSave = database.CompanySales.findOne.mockImplementation(() => findOneResponse);

    const response = await findOne({
      params: { ID: 1 },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 200,
      data: findOneResponse,
    });

    mockSave.mockRestore();
  });

  it('when I use findOne with some error should return error status', async () => {
    const mockSave = database.CompanySales.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findOne({
      params: { ID: 1 },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
