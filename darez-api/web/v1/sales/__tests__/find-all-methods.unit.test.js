const { findAllMethods } = require('../findAllMethods');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    SaleMethod: {
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

const databaseReturnedData = [
  {
    method: 'Crédito',
    operator: 1,
  },
  {
    method: 'Débito',
    operator: 1,
  },
  {
    method: 'Dinheiro',
    operator: 1,
  },
  {
    method: 'Despesa',
    operator: -1,
  },
];

const finalData = [
  {
    name: 'Crédito',
    operator: 1,
  },
  {
    name: 'Débito',
    operator: 1,
  },
  {
    name: 'Dinheiro',
    operator: 1,
  },
  {
    name: 'Despesa',
    operator: -1,
  },
];

describe('Unit Test: sales/findAllMethods', () => {
  it('when I use findAllMethods should return sales by Id', async () => {
    const mockSave = database.SaleMethod.findAll.mockImplementation(() => databaseReturnedData);

    const response = await findAllMethods();

    expect(response).toEqual({
      statusCode: 200,
      data: finalData,
    });

    mockSave.mockRestore();
  });

  it('when I use findAllMethods with some error should return error status', async () => {
    const mockSave = database.SaleMethod.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findAllMethods();

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
