process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { kadernet } = require('../kadernet');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    CompanySales: {
      findAll: jest.fn(),
    },
    Company: {
      findOne: jest.fn(),
    },
    sequelize: {
      query: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('pdf-creator-node', () => ({
  create: jest.fn(() => ({
    then: jest.fn(() => ({
      catch: jest.fn(),
    })),
  })),
}));

jest.mock('pdf-lib', () => ({
  PDFDocument: {
    create: jest.fn(() => ({
      copyPages: jest.fn(() => []),
      addPage: jest.fn(),
      save: jest.fn(() => []),
    })),
    load: jest.fn(() => ({
      getPageIndices: jest.fn(),
    })),
  },
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => 'Buffer with bytes'),
  open: jest.fn((_p, _m, cb) => cb()),
  write: jest.fn((_fd, _buf, _a, _b, _c, cb) => cb()),
  close: jest.fn((_fd, cb) => cb()),
  unlinkSync: jest.fn(),
}));

describe('Unit Test: reports/kadernet', () => {
  it('When I call kadernet should return Base64 file', async () => {
    const mockSave1 = database.Company.findOne.mockImplementation(() => ({
      logo: 'logo',
      fantasy_name: 'fantasy_name',
      phone_area_code: '11',
      phone_number: '912345678',
      street: 'street',
      street_number: 1,
      address_2: null,
      neighborhood: 'neighborhood',
      city: 'city',
      state: 'state',
    }));
    const mockSave2 = database.CompanySales.findAll
      .mockImplementation(() => [
        {
          sale_time: '02-01-2021z09:10:00', description: 'Description', sale_method: 'Crédito', price: 10.90, 'CompanyClient.name': 'Client Name',
        },
        {
          sale_time: '02-02-2021z08:20:00', description: 'Description 2', sale_method: 'Despesa', price: 5.00, 'CompanyClient.name': null,
        },
        {
          sale_time: '02-03-2021z10:30:00', description: 'Description 3', sale_method: 'Dinheiro', price: 7.99, 'CompanyClient.name': 'New Client',
        },
      ]);
    const mockSave3 = database.sequelize.query.mockImplementation(() => [
      {
        method: 'Crédito', operator: 1, total: 10, countSaleMethod: 2,
      },
      {
        method: 'Débito', operator: 1, total: 5, countSaleMethod: 1,
      },
      {
        method: 'Dinheiro', operator: 1, total: 0, countSaleMethod: '0.00',
      },
      {
        method: 'Despesa', operator: -1, total: 5, countSaleMethod: 3,
      },
    ]);

    const response = await kadernet({
      companyId: 1,
      query: { start: '01/02/2021', end: '20/02/2021' },
    });

    expect(response.statusCode).toEqual(200);
    expect(response.data).toHaveProperty('report');
    expect(response.data.report).toEqual('Buffer with bytes');

    mockSave1.mockRestore();
    mockSave2.mockRestore();
    mockSave3.mockRestore();
  });

  it('When I call kadernet and some error occurs should return status of error', async () => {
    const mockSave1 = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await kadernet({
      companyId: 1,
      query: { start: '01/02/2021', end: '20/02/2021' },
    });

    expect(response.statusCode).toEqual(500);

    mockSave1.mockRestore();
  });
});
