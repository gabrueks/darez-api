const SaleMethodRepository = require('../sale_method');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    SaleMethod: {
      findAll: jest.fn(),
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

describe('Unit Test: SaleMethod Repository', () => {
  it('when I call findAll should return all sale methods names and operators', async () => {
    const mockSave = database.SaleMethod.findAll.mockImplementation(() => (databaseReturnedData));

    const saleMethodRepository = new SaleMethodRepository(database);
    const r1 = await saleMethodRepository.findAll();
    expect(r1).toEqual(finalData);
    mockSave.mockRestore();
  });

  it('when I call findAll and some exception occurs then should throw an exception', async () => {
    const mockSave = database.SaleMethod.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const saleMethodRepository = new SaleMethodRepository(database);
    try {
      await saleMethodRepository.findAll();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
