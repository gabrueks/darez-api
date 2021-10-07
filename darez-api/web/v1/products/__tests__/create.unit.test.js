const { create } = require('../create');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Company: {
      findOne: jest.fn(() => ({
        User: { confirmation_code: 123456, full_name: 'Full Name' },
      })),
    },
    Product: {
      create: jest.fn(),
      update: jest.fn(),
      max: jest.fn(),
    },
    ProductVariation: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: { create: jest.fn() },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const reqBody = {
  name: 'Product Name',
  description: 'Product Desc',
  price: 100,
  category: 'cat 1',
  subcategory: 'sub 1',
};

const reqVariation = {
  variations: [
    {
      id: 1,
      color: 'red',
      size: 'P',
    },
    {
      id: 0,
      color: 'blue',
      size: 'P',
    },
  ],
};

describe('Unit Test: product/create', () => {
  it('when I call create with variation should create a new product with variations', async () => {
    const mockSave = database.Product.create.mockImplementation(() => ({
      dataValues: { id: 1 },
    }));
    const response = await create({
      body: { ...reqBody, ...reqVariation },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 201,
      data: { product_id: 1 },
    });
    mockSave.mockRestore();
  });

  it('when I call create without variation should create a new product', async () => {
    const mockSave = database.Product.create.mockImplementation(() => ({
      dataValues: { id: 1 },
    }));
    const response = await create({ body: { ...reqBody }, companyId: 1 });

    expect(response).toEqual({
      statusCode: 201,
      data: { product_id: 1 },
    });
    mockSave.mockRestore();
  });

  it('when I call create with some error should return a status of error', async () => {
    const mockSave = database.Product.create.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await create({
      body: { ...reqBody, ...reqVariation },
      companyId: 1,
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
