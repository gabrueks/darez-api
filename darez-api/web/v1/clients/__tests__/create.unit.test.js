const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyClients: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: clients/create', () => {
  it('when I use create should create a new client to a company', async () => {
    const mockSave = database.CompanyClients.create.mockImplementation(() => ({
      dataValues: {
        id: 1,
      },
    }));

    const response = await create({
      body: {
        name: 'name', phone_country_code: '55', phone_area_code: '11', phone_number: '912345678',
      },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 201,
      data: { id: 1, company_id: 1 },
    });

    mockSave.mockRestore();
  });

  it('when I use create with some error should return error status', async () => {
    const mockSave = database.CompanyClients.create.mockImplementation(() => { throw new Error('Some error'); });

    const response = await create({
      body: {
        name: 'name', phone_country_code: '55', phone_area_code: '11', phone_number: '912345678',
      },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
