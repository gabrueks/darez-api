const UserAsaasRepository = require('../user_asaas');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    UserAsaas: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Unit Test: UserAsaasRepository', () => {
  it('when I call findOne then should return its data', async () => {
    const mockSave = database.UserAsaas.findOne.mockImplementation(() => ({
      id: 19,
      user_id: 1,
      company_id: 10,
      asaas_id: 'asaas_id',
    }));

    const userAsaasRepository = new UserAsaasRepository(database);
    const response = await userAsaasRepository.findOne(1, 10, ['id', 'user_id', 'company_id', 'asaas_id']);
    expect(response).toEqual({
      id: 19,
      user_id: 1,
      company_id: 10,
      asaas_id: 'asaas_id',
    });

    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserAsaas.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const userAsaasRepository = new UserAsaasRepository(database);
    try {
      await userAsaasRepository.findOne();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call create should create the asaas user', async () => {
    const mockSave = database.UserAsaas.create.mockImplementation(() => ({ asaas_id: 'asaas_id' }));

    const userAsaasRepository = new UserAsaasRepository(database);
    const response = await userAsaasRepository.create({
      user_id: 1,
      company_id: 10,
      asaas_id: 'asaas_id',
      asaas_created_at: '2020-01-01',
      asaas_object: 'object',
      asaas_account_key: 'asaas_key',
    });
    expect(response).toEqual({ asaas_id: 'asaas_id' });

    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.UserAsaas.create.mockImplementation(() => { throw new Error('Some error'); });

    const userAsaasRepository = new UserAsaasRepository(database);
    try {
      await userAsaasRepository.create({
        user_id: 1,
        company_id: 10,
        asaas_id: 'asaas_id',
        asaas_created_at: '2020-01-01',
        asaas_object: 'object',
        asaas_account_key: 'asaas_key',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
