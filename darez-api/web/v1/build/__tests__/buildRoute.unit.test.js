process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { buildRoute } = require('../buildRoute');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Company: {
      findAll: jest.fn(),
    },
    Category: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('fs');

jest.mock('../../../../infrastructure/adapters/aws', () => ({
  s3Client: {
    upload: jest.fn(() => ({
      promise: jest.fn(() => ({ Key: 'file_key' })),
    })),
  },
}));

jest.mock('../../helpers/files', () => ({
  writeFile: jest.fn(() => ({ path: 'uploads/file_name.json', destination: 'uploads/', filename: 'file_name.json' })),
}));

const dbReturnedData = [
  {
    id: 44,
    endpoint: 'endpoint',
    fantasy_name: 'Nome Fantasia',
    banner: 'banner_key.png',
    phone_number: '912345678',
    logo: 'logo_key.png',
    phone_country_code: '55',
    phone_area_code: '11',
    cep: '12345678',
    street: 'Rua Quata',
    street_number: 51,
    address_2: 'B',
    neighborhood: 'Vila Olimpia',
    city: 'São Paulo',
    state: 'SP',
    delivery_range: 5,
    latitude: -23.111111,
    longitude: -46.222222,
    category: null,
    'Products.id': 791,
    'Products.name': 'Nome Prod',
    'Products.description': '',
    'Products.category': 'Alimentação',
    'Products.subcategory': 'Outros',
    'Products.sort_id': 1,
    'Products.promotion': null,
    'Products.promotion_price': null,
    'Products.price': '5.00',
    'Products.ProductVariations.id': 792,
    'Products.ProductVariations.color': '',
    'Products.ProductVariations.size': '5',
    'Products.ProductPhotos.id': 442,
    'Products.ProductPhotos.photo_key': 'photo_key.png',
    'Products.ProductPhotos.thumbnail': null,
    'Products.ProductPhotos.is_main': 0,
  },
];

describe('Unit Test: build/buildRoute', () => {
  it('when I use buildRoute should return the new file key and the bucket url', async () => {
    const mockSaveCompanies = database.Company.findAll.mockImplementation(() => dbReturnedData);
    const mockSaveCategories = database.Category.findAll.mockImplementation(() => [
      { dataValues: { name: 'cat 1', icon: 'icon1', banner: 'banner1' } }, { dataValues: { name: 'cat 2', icon: 'icon2', banner: 'banner2' } }]);

    const response = await buildRoute();

    expect(response).toEqual({
      statusCode: 201,
      data: { bucket_url: 'https://s3host.teste.com/', file_key: 'file_key' },
    });

    mockSaveCompanies.mockRestore();
    mockSaveCategories.mockRestore();
  });

  it('when I use buildRoute with some error should return a status of error', async () => {
    const mockSaveCompanies = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });
    const mockSaveCategories = database.Category.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await buildRoute();

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSaveCompanies.mockRestore();
    mockSaveCategories.mockRestore();
  });
});
