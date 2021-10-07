const { getOne } = require('../getOne');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyClients: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: clients/getOne', () => {
  it('when I use getOne should return a specific client', async () => {
    const mockSave = database.CompanyClients.findOne.mockImplementation(() => ({
      id: 1,
      company_id: 882,
      name: 'New name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      email: null,
    }));

    const response = await getOne({
      params: { ID: 1 },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        id: 1,
        company_id: 882,
        name: 'New name',
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '912345678',
        email: null,
      },
    });

    mockSave.mockRestore();
  });

  it('when I use getOne with some error should return error status', async () => {
    const mockSave = database.CompanyClients.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await getOne({
      params: { ID: 1 },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
