const { getPaymentMethods } = require('../getPaymentMethod');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyPayment: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: companies/getPaymentMethod', () => {
  it('when I call getPaymentMethods should return all methods from a company', async () => {
    const mockSave = database.CompanyPayment.findAll.mockImplementation(() => [
      { method: 'm1', 'PaymentMethod.online': 1, 'PaymentMethod.has_change': 0 },
      { method: 'm2', 'PaymentMethod.online': 0, 'PaymentMethod.has_change': 1 }]);
    const response = await getPaymentMethods({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        methods: [
          { name: 'm1', online: 1, has_change: 0 },
          { name: 'm2', online: 0, has_change: 1 },
        ],
      },
    });
    mockSave.mockRestore();
  });

  it('when I call getPaymentMethods with some error should return a status of error', async () => {
    const mockSave = database.CompanyPayment.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const response = await getPaymentMethods({ params: { ID: '1' } });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
