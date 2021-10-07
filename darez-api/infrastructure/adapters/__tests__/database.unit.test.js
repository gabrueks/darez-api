const database = require('../../database/models');
const { setupDatabaseConnection } = require('../database');

jest.mock('../../database/models');

describe('Unit Test: Database Adapter', () => {
  it('when I call setupDatabaseConnection method then should call sequelize database instance authenticate', async () => {
    await setupDatabaseConnection();
    expect(database.sequelize.authenticate).toHaveBeenCalledTimes(1);
  });

  it('when I call setupDatabaseConnection method and have some error then should throw an exception', async () => {
    database.sequelize.authenticate.mockImplementation(() => {
      throw new Error('Some error');
    });

    try {
      await setupDatabaseConnection();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });
});
