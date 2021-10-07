const BuildRepository = require('../build');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Company: {
      findAll: jest.fn(),
    },
  },
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

const funcReturnedData = [{
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

  products:
  [
    {
      id: 791,
      name: 'Nome Prod',
      description: '',
      category: 'Alimentação',
      subcategory: 'Outros',
      sort_id: 1,
      promotion: null,
      promotion_price: null,
      price: '5.00',
      variations:
      [
        {
          id: 792,
          color: '',
          size: '5',
        },
      ],
      photos:
      [
        {
          id: 442,
          photo_key: 'photo_key.png',
          thumbnail: null,
          is_main: 0,
        },
      ],
    },
  ],
}];

describe('Unit Test: Build Repository', () => {
  it('when I call getCompanies return all companies & products infos', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => dbReturnedData);

    const companiesAttributes = ['id', 'endpoint', 'fantasy_name', 'banner', 'phone_number',
      'logo', 'phone_country_code', 'phone_area_code', 'cep', 'street', 'street_number',
      'address_2', 'neighborhood', 'city', 'state', 'delivery_range', 'latitude', 'longitude',
      'category'];

    const productAttributes = ['id', 'name', 'description', 'category', 'subcategory', 'sort_id',
      'promotion', 'promotion_price', 'price'];

    const productVariationAttributes = ['id', 'color', 'size'];

    const productPhotosAttributes = ['id', 'photo_key', 'is_main', 'thumbnail'];

    const buildRepository = new BuildRepository(database);
    const response = await buildRepository.getCompanies(
      companiesAttributes, productAttributes, productVariationAttributes, productPhotosAttributes,
    );
    expect(response).toEqual(funcReturnedData);
    mockSave.mockRestore();
  });

  it('when I call getCompanies and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companiesAttributes = ['id', 'endpoint', 'fantasy_name', 'banner', 'phone_number',
      'logo', 'phone_country_code', 'phone_area_code', 'cep', 'street', 'street_number',
      'address_2', 'neighborhood', 'city', 'state', 'delivery_range', 'latitude', 'longitude',
      'category'];

    const productAttributes = ['id', 'name', 'description', 'category', 'subcategory', 'sort_id',
      'promotion', 'promotion_price', 'price'];

    const productVariationAttributes = ['id', 'color', 'size'];

    const productPhotosAttributes = ['id', 'photo_key', 'is_main', 'thumbnail'];

    const buildRepository = new BuildRepository(database);
    try {
      await buildRepository.getCompanies(
        companiesAttributes, productAttributes, productVariationAttributes, productPhotosAttributes,
      );
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
