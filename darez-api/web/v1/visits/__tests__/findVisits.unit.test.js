const { findVisits } = require('../findVisits');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyVisit: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: visit/findVisits', () => {
  it('when I use findVisits without any parameters should return all visits', async () => {
    const visits = [
      {
        company_id: 1,
        visits: 1,
      },
      {
        company_id: 2,
        visits: 12,
      },
      {
        company_id: 3,
        visits: 3,
      },
    ];
    const mockSave = database.CompanyVisit.findAll.mockImplementation(() => (visits));

    const response = await findVisits({ query: {} });
    expect(response).toEqual({
      statusCode: 200,
      data: visits,
    });

    mockSave.mockRestore();
  });

  it('when I use findVisits with companies and dates should return filtered visits', async () => {
    const visits = [
      {
        company_id: 2,
        visits: 4,
      },
      {
        company_id: 3,
        visits: 1,
      },
    ];
    const mockSave = database.CompanyVisit.findAll.mockImplementation(() => (visits));

    const response = await findVisits({
      query: {
        companies: '[2,3]',
        before: '2020-01-02 10:30:00',
        after: '2020-01-01',
      },
    });
    expect(response).toEqual({
      statusCode: 200,
      data: visits,
    });

    mockSave.mockRestore();
  });

  it('when I use findVisits with error should return error', async () => {
    const mockSave = database.CompanyVisit.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findVisits({
      query: {
        companies: '[2,3]',
        before: '2020-01-02 10:30:00',
        after: '2020-01-01',
      },
    });
    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
