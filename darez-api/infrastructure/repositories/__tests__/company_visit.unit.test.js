const CompanyVisitRepository = require('../company_visit');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    CompanyVisit: {
      create: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

const databaseReturnedData = [{
  company_id: 1,
  ipv4: 'ipv4',
}];

const databaseReturnedDataFindOne = [{
  created_at: 'date',
}];

describe('Unit Test: Company Visit Repository', () => {
  it('when I call create then should create a visit and return his data', async () => {
    const mockSave = database.CompanyVisit.create.mockImplementation(() => (
      { dataValues: databaseReturnedData }
    ));

    const companyVisitRepository = new CompanyVisitRepository(database);
    const { dataValues } = await companyVisitRepository.create(1, 'ipv4');

    expect(dataValues).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });
  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyVisit.create.mockImplementation(() => { throw new Error('Some error'); });

    const companyVisitRepository = new CompanyVisitRepository(database);
    try {
      await companyVisitRepository.create(1, 'ipv4');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call find one visit then should return the last occured visit', async () => {
    const mockSave = database.CompanyVisit.findOne.mockImplementation(() => (
      { dataValues: databaseReturnedDataFindOne }
    ));

    const companyVisitRepository = new CompanyVisitRepository(database);
    const { dataValues } = await companyVisitRepository.findOne(1);

    expect(dataValues).toEqual(databaseReturnedDataFindOne);
    mockSave.mockRestore();
  });

  it('when I call find one visit and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyVisit.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyVisitRepository = new CompanyVisitRepository(database);
    try {
      await companyVisitRepository.findOne(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
