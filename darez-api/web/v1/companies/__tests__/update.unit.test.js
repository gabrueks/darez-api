const { update } = require('../update');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Company: {
      findOne: jest.fn(),
      update: jest.fn(),
    },
    BusinessHours: {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    User: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/maps', () => ({
  geocoder: {
    geocode: jest.fn(() => ([{ latitude: 1, longitude: 2 }])),
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const reqCreateUpdateCompanies = {
  body: {
    user_id: 1,
    document: '012312312344',
    fantasy_name: 'Lojinha do Deco',
    cep: '01231010',
    street: 'Street',
    street_number: 200,
    address_2: null,
    neighborhood: 'Neighborhood',
    city: 'City',
    state: 'State',
    phone_country_code: '55',
    phone_area_code: '11',
    phone_number: '912345678',
    schedule: [
      {
        day: 1,
        open_time: '12:00',
        close_time: '19:00',
      },
    ],
  },
};

describe('Unit Test: companies/update', () => {
  it('when I use update should update a company', async () => {
    const params = { ID: 1 };
    const { body } = reqCreateUpdateCompanies;
    const mockSave = database.Company.findOne.mockImplementation(() => ({ dataValues: { id: 1 }, endpoint: 'loja teste' }));
    const mockSave2 = database.User.findOne.mockImplementation(() => ({ confirmation_code: 123456, full_name: 'Full Name' }));
    const response = await update({ params, body });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I call update without params should update a company', async () => {
    const { body } = reqCreateUpdateCompanies;
    const mockSave = database.Company.findOne.mockImplementation(() => ({ dataValues: { id: 1 }, endpoint: 'loja teste' }));
    const mockSave2 = database.User.findOne.mockImplementation(() => ({ confirmation_code: 123456, full_name: 'Full Name' }));
    const response = await update({
      companyId: 1, userId: 1, body, params: {},
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });

  it('when I use update with some error should return a status of error', async () => {
    const params = { ID: 1 };
    const { body } = reqCreateUpdateCompanies;
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const mockSave2 = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await update({ params, body });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });
});
