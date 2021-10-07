const AsaasTransferDataRepository = require('../asaas_transfer_data');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    AsaasTransferData: {
      create: jest.fn(),
    },
  },
}));

const createObject = {
  company_id: 1,
  asaas_id: 'asaas_id',
  asaas_created_at: '2020-10-07',
  asaas_object: 'tranfer',
  value: 10.80,
  net_value: 10.80,
  asaas_status: 'PENDING',
  asaas_transfer_fee: 5.00,
  asaas_schedule_date: '2020-10-08',
  asaas_authorized: true,
  asaas_transaction_receipt_url: 'transcation_url',
};

describe('Unit Test: Category Repository', () => {
  it('when I call create should create a new transfer data', async () => {
    const mockSave = database.AsaasTransferData.create.mockImplementation(() => (createObject));

    const asaasTransferDataRepository = new AsaasTransferDataRepository(database);
    const result = await asaasTransferDataRepository.create(createObject);
    expect(result).toEqual(createObject);
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.AsaasTransferData.create.mockImplementation(() => { throw new Error('Some error'); });

    const asaasTransferDataRepository = new AsaasTransferDataRepository(database);
    try {
      await asaasTransferDataRepository.create(createObject);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
