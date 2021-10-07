process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';
const axios = require('axios').default;
const { findPreferences } = require('../findPreferences');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
    },
    Product: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  },
  create: jest.fn(),
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const databaseReturnedDataFindAll = {
  id: 1,
  company_id: 1,
  name: 'product name',
  description: 'some description',
  price: 12.99,
  promotion_price: 10.0,
  category: 'some category',
  subcategory: 'some subcategory',
  ProductPhotos: [{ photo_key: 'product_photo_url' }],
  Company: {
    dataValues: {
      distance: 1,
      endpoint: 'endpoint',
    },
  },
  Promotion: {
    id: 1,
    created_by: 'Name',
    date_start: 'startDate',
    date_end: 'endDate',
    discount: 10,
    has_limit_date: 1,
  },
};

const axiosGetResponse = {
  data: {
    recent: {
      catProd: {
        name: 'category',
        count: 1,
      },
      catPage: {
        name: 'category',
        count: 1,
      },
    },
    total: {
      catProd: {
        name: 'category',
        count: 1,
      },
      catPage: {
        name: 'category',
        count: 1,
      },
    },
  },
};

const resultPreferences = {
  recent: {
    product_page: {
      products: [
        {
          id: 1,
          company_id: 1,
          name: 'product name',
          description: 'some description',
          price: 12.99,
          promotion_price: 10.0,
          category: 'some category',
          subcategory: 'some subcategory',
          photo_key: ['product_photo_url'],
          distance: 1,
          company_endpoint: 'endpoint',
          promotion: {
            id: 1,
            created_by: 'Name',
            date_start: 'startDate',
            date_end: 'endDate',
            discount: 10,
            has_limit_date: 1,
          },
        },
      ],
      category: 'category',
      count: 1,
    },
    category_page: {
      products: [
        {
          id: 1,
          company_id: 1,
          name: 'product name',
          description: 'some description',
          price: 12.99,
          promotion_price: 10.0,
          category: 'some category',
          subcategory: 'some subcategory',
          photo_key: ['product_photo_url'],
          distance: 1,
          company_endpoint: 'endpoint',
          promotion: {
            id: 1,
            created_by: 'Name',
            date_start: 'startDate',
            date_end: 'endDate',
            discount: 10,
            has_limit_date: 1,
          },
        },
      ],
      category: 'category',
      count: 1,
    },
  },
  total: {
    product_page: {
      products: [
        {
          id: 1,
          company_id: 1,
          name: 'product name',
          description: 'some description',
          price: 12.99,
          promotion_price: 10.0,
          category: 'some category',
          subcategory: 'some subcategory',
          photo_key: ['product_photo_url'],
          distance: 1,
          company_endpoint: 'endpoint',
          promotion: {
            id: 1,
            created_by: 'Name',
            date_start: 'startDate',
            date_end: 'endDate',
            discount: 10,
            has_limit_date: 1,
          },
        },
      ],
      category: 'category',
      count: 1,
    },
    category_page: {
      products: [
        {
          id: 1,
          company_id: 1,
          name: 'product name',
          description: 'some description',
          price: 12.99,
          promotion_price: 10.0,
          category: 'some category',
          subcategory: 'some subcategory',
          photo_key: ['product_photo_url'],
          distance: 1,
          company_endpoint: 'endpoint',
          promotion: {
            id: 1,
            created_by: 'Name',
            date_start: 'startDate',
            date_end: 'endDate',
            discount: 10,
            has_limit_date: 1,
          },
        },
      ],
      category: 'category',
      count: 1,
    },
  },
};

describe('Unit Test: products/findPreferences', () => {
  it('when I call findPreferences show product info', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => [
      databaseReturnedDataFindAll,
    ]);
    const mockSaveAxios = axios.get.mockImplementation(() => axiosGetResponse);
    const response = await findPreferences({
      query: { lat: 1, lng: 1 },
      headers: { authorization: 'token' },
      userId: 1,
    });

    expect(response).toEqual({
      statusCode: 200,
      data: { bucket_url: 'https://s3host.teste.com/', ...resultPreferences },
    });
    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });

  it('when I call findPreferences with some error should return a status of error', async () => {
    const mockSave = database.Product.findAll.mockImplementation(() => {
      throw new Error('Some error');
    });
    const mockSaveAxios = axios.get.mockImplementation(() => axiosGetResponse);
    const response = await findPreferences({
      query: { lat: 1, lng: 1 },
      headers: { authorization: 'token' },
      userId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
    mockSaveAxios.mockRestore();
  });
});
