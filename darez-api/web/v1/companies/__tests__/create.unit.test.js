process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Company: {
      findAll: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    },
    Product: {
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
    BusinessHours: {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    User: {
      findOne: jest.fn(),
      update: jest.fn(),
    },
    CompanyPayment: {
      create: jest.fn(),
      findAll: jest.fn(),
    },
    UserGroup: {
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

jest.mock('jsonwebtoken', () => ({
  sign: () => 'access_token_test',
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

describe('Unit Test: companies/create', () => {
  it('when I use create should create a company', async () => {
    const mockSave = database.Company.create.mockImplementation(() => ({ dataValues: { id: 1 } }));
    const mockSave2 = database.User.findOne.mockImplementation(() => ({
      confirmation_code: 123456, full_name: 'Full Name', phone_country_code: '55', phone_area_code: '11', phone_number: '912345678',
    }));
    const mockSave3 = database.UserGroup.findOne.mockImplementation(() => ({ id: 3 }));
    const response = await create(reqCreateUpdateCompanies);

    expect(response).toEqual({
      statusCode: 201,
      data: {
        access_token: 'access_token_test',
        user_group: 3,
      },
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
    mockSave3.mockRestore();
  });

  it('when I use create with some error should return a status of error', async () => {
    const mockSave = database.Company.create.mockImplementation(() => { throw new Error('Some error'); });
    const mockSave2 = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const response = await create(reqCreateUpdateCompanies);

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
    mockSave2.mockRestore();
  });
});
