const { findNeighborhood } = require('../findNeighborhood');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnNeighborhood = [
  {
    city: 'city1',
    neighborhood: 'neighborhood1',
  },
  {
    city: 'city2',
    neighborhood: 'neighborhood2',
  },
];

describe('Unit Test: comapnies/findNeighborhood', () => {
  it('when I use findNeighborhood should return all neighborhoods from the database', async () => {
    const mockSave = database.Company.findAll.mockImplementation(
      () => (databaseReturnNeighborhood),
    );
    const response = await findNeighborhood();

    expect(response).toEqual({
      statusCode: 200,
      data: { city1: ['neighborhood1'], city2: ['neighborhood2'] },
    });

    mockSave.mockRestore();
  });

  it('when I use findNeighborhood with some error should return a status of error', async () => {
    const mockSave = database.Company.findAll.mockImplementation(
      () => { throw new Error('Some error'); },
    );
    const response = await findNeighborhood();

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
