const { findUserCompanies } = require('../findUserCompanies');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    User: {
      findOne: jest.fn(),
    },
    Company: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const findUserCompaniesResponse = {
  id: 1,
  full_name: 'nome',
  company: {
    id: 1,
    user_id: 1,
    document: '12334554345',
    fantasy_name: 'loja teste',
    cep: '09876543',
    street: 'rua teste',
    street_number: 100,
    address_2: '',
    neighborhood: 'bairro',
    city: 'sao paulo',
    state: 'sp',
    delivery_range: 5,
    latitude: -23.566065,
    longitude: -46.67886,
    banner: 'banner',
    logo: 'logo',
    endpoint: 'loja-teste',
    phone_country_code: '55',
    phone_area_code: '11',
    phone_number: '123456789',
    active: 1,
    created_at: 'dataCri',
    updated_at: 'dataUp',
  },
};

const companyDbResponse = {
  id: 1,
  user_id: 1,
  document: '12334554345',
  fantasy_name: 'loja teste',
  cep: '09876543',
  street: 'rua teste',
  street_number: 100,
  address_2: '',
  neighborhood: 'bairro',
  city: 'sao paulo',
  state: 'sp',
  delivery_range: 5,
  latitude: -23.566065,
  longitude: -46.67886,
  banner: 'banner',
  logo: 'logo',
  endpoint: 'loja-teste',
  phone_country_code: '55',
  phone_area_code: '11',
  phone_number: '123456789',
  active: 1,
  created_at: 'dataCri',
  updated_at: 'dataUp',
};

describe('Unit Test: users/findUserCompanies', () => {
  it('when I use findUserCompanies should return a single user information with success code', async () => {
    const mockSaveUser = database.User.findOne.mockImplementation(() => ({ id: 1, full_name: 'nome' }));
    const mockSaveCompany = database.Company.findOne.mockImplementation(() => (companyDbResponse));

    const response = await findUserCompanies(1);

    expect(response).toEqual({
      statusCode: 200,
      data: findUserCompaniesResponse,
    });

    mockSaveUser.mockRestore();
    mockSaveCompany.mockRestore();
  });

  it('when I use findUserCompanies with some error should return a status of error', async () => {
    const mockSaveUser = database.User.findOne.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveCompany = database.Company.findOne.mockImplementation(() => (companyDbResponse));

    const response = await findUserCompanies(1);

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSaveUser.mockRestore();
    mockSaveCompany.mockRestore();
  });
});
