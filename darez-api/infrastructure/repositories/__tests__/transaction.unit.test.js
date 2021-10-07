const TransactionRepository = require('../transaction');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn(() => ({})),
    },
  },
}));

const transaction = {

  commit: async () => 'commit',
  rollback: async () => 'rollback',
};

const transactionErr = {

  commit: async () => { throw new Error('Some error'); },
  rollback: async () => { throw new Error('Some error'); },
};

describe('Unit Test: Transaction Repository', () => {
  it('when I call initialize should return a transaction instace', async () => {
    const mockSave = database.sequelize.transaction.mockImplementation(() => (transaction));

    const transactionRepository = new TransactionRepository(database);
    const result = await transactionRepository.initialize();

    expect(result).toEqual(transaction);
    mockSave.mockRestore();
  });

  it('when I call initialize and some exception occurs then should throw an exception', async () => {
    const mockSave = database.sequelize.transaction.mockImplementation(() => { throw new Error('Some error'); });

    const transactionRepository = new TransactionRepository(database);
    try {
      await transactionRepository.initialize();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call commit should return a commit from a transaction', async () => {
    const transactionRepository = new TransactionRepository(database);
    const result = await transactionRepository.commit(transaction);

    expect(result).toEqual('commit');
  });

  it('when I call commit and some exception occurs then should throw an exception', async () => {
    const transactionRepository = new TransactionRepository(database);
    try {
      await transactionRepository.commit(transactionErr);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });

  it('when I call rollback should return a rollback from a transaction', async () => {
    const transactionRepository = new TransactionRepository(database);
    const result = await transactionRepository.rollback(transaction);

    expect(result).toEqual('rollback');
  });

  it('when I call rollback and some exception occurs then should throw an exception', async () => {
    const transactionRepository = new TransactionRepository(database);
    try {
      await transactionRepository.rollback(transactionErr);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });
});
