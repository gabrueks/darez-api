const { getAllCompany } = require('../getAllCompany');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyClients: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: clients/getAllCompany', () => {
  it('when I use getAllCompany should return a specific client', async () => {
    const mockSave = database.CompanyClients.findAll.mockImplementation(() => [{
      id: 1,
      company_id: 882,
      name: 'New name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      email: null,
    }]);

    const response = await getAllCompany({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 200,
      data: [{
        id: 1,
        company_id: 882,
        name: 'New name',
        phone_country_code: '55',
        phone_area_code: '11',
        phone_number: '912345678',
        email: null,
      }],
    });

    mockSave.mockRestore();
  });

  it('when I use getAllCompany with some error should return error status', async () => {
    const mockSave = database.CompanyClients.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await getAllCompany({
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: { },
    });

    mockSave.mockRestore();
  });
});
