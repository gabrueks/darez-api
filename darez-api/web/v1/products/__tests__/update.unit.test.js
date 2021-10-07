const { update } = require('../update');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    sequelize: {
      transaction: jest.fn((f) => f()),
    },
    Product: {
      update: jest.fn(),
    },
    ProductVariation: {
      create: jest.fn(),
      update: jest.fn(),
    },
    ProductPhoto: {
      findOne: jest.fn(),
      update: jest.fn(),
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

describe('Unit Test: products/update', () => {
  it('when I call update with variation should update a product and its variations', async () => {
    const response = await update({
      params: { ID: '1' },
      body: { ...reqBody, ...reqVariation },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });

  it('when I call update without variation should update a product', async () => {
    const response = await update({
      params: { ID: '1' },
      body: { ...reqBody },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
  });

  it('when I call update with main_image and is the first main of it should update a product main image', async () => {
    const mockSave = database.ProductPhoto.findOne.mockImplementation(() => null);

    const response = await update({
      params: { ID: '1' },
      body: { main_image: 1 },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I call update with main_image that already has a main image should update a product main image and delete the old one', async () => {
    const mockSave = database.ProductPhoto.findOne.mockImplementation(() => ({ id: 2 }));

    const response = await update({
      params: { ID: '1' },
      body: { main_image: 1 },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I call update with some error should return a status of error', async () => {
    const mockSave = database.Product.update.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await update({
      params: { ID: '1' },
      body: { ...reqBody },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
