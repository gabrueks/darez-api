const CompanyPaymentRepository = require('../company_payment');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    CompanyPayment: {
      create: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

describe('Unit Test: Order Product Repository', () => {
  it('when I call create then should create payment method to company', async () => {
    const companyPaymentRepository = new CompanyPaymentRepository(database);
    await companyPaymentRepository.create(1, 'method');

    expect(database.CompanyPayment.create).toHaveBeenCalledTimes(1);
  });

  it('when I call create many and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyPayment.create.mockImplementation(() => { throw new Error('Some error'); });

    const companyPaymentRepository = new CompanyPaymentRepository(database);
    try {
      await companyPaymentRepository.create(1, 'method');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany then should return a list of payment methods', async () => {
    const mockSave = database.CompanyPayment.findAll.mockImplementation(() => [
      { method: 'm1', 'PaymentMethod.online': 1, 'PaymentMethod.has_change': 0 },
      { method: 'm2', 'PaymentMethod.online': 0, 'PaymentMethod.has_change': 1 }]);

    const companyPaymentRepository = new CompanyPaymentRepository(database);
    const result = await companyPaymentRepository.findAllFromCompany(1);

    expect(result).toEqual([
      { name: 'm1', online: 1, has_change: 0 },
      { name: 'm2', online: 0, has_change: 1 },
    ]);

    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany many and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyPayment.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companyPaymentRepository = new CompanyPaymentRepository(database);
    try {
      await companyPaymentRepository.findAllFromCompany(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
