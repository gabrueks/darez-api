process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { findCategories } = require('../findCategories');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize:
    {
      literal: jest.fn(() => ({})),
    },
    Category: {
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: categories/findCategories', () => {
  it('when I use findCategories should return all categories data', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => [
      { dataValues: { name: 'cat 1', icon: 'icon1', banner: 'banner1' } }, { dataValues: { name: 'cat 2', icon: 'icon2', banner: 'banner2' } }]);

    const response = await findCategories({ query: {} });

    expect(response).toEqual({
      statusCode: 200,
      data: { bucket_url: 'https://s3host.teste.com/', categories: [{ name: 'cat 1', icon: 'icon1', banner: 'banner1' }, { name: 'cat 2', icon: 'icon2', banner: 'banner2' }] },
    });

    mockSave.mockRestore();
  });

  it('when I use findCategories with latitude and longitude should return all categories data given a range', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => [
      { dataValues: { name: 'cat 1', icon: 'icon1', banner: 'banner1' } }]);

    const response = await findCategories({ query: { lat: 1.000001, lng: 2.200002 } });

    expect(response).toEqual({
      statusCode: 200,
      data: { bucket_url: 'https://s3host.teste.com/', categories: [{ name: 'cat 1', icon: 'icon1', banner: 'banner1' }] },
    });

    mockSave.mockRestore();
  });

  it('when I use findCategories with some error should return a status of error', async () => {
    const mockSave = database.Category.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const response = await findCategories({ query: {} });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
