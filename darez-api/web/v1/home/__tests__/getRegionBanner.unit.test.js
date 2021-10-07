process.env.AWS_BUCK_URL = 'https://s3host.teste.com/';

const { getBanners } = require('../getRegionBanner');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    HomeSetupRegions: {
      findAll: jest.fn(),
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

jest.mock('fs');

const resultSetShop = [
  {
    banner_url_high_res: 'banner_url_high_res',
    banner_url_low_res: 'banner_url_low_res',
    main_banner: false,
  },
];

const resultSetMainShop = [
  {
    banner_url_high_res: 'banner_url_high_res',
    banner_url_low_res: 'banner_url_low_res',
    main_banner: true,
  },
];

describe('Unit Test: Home Setup Company', () => {
  it('when I use getBanners should return all companies from a range', async () => {
    const mockSave = database.HomeSetupRegions.findAll.mockImplementation(() => (resultSetShop));
    const response = await getBanners({ query: { lat: 1.000001, lng: 2.200002 } });
    expect(response).toEqual({
      statusCode: 200,
      data: { banners: resultSetShop, bucket_url: 'https://s3host.teste.com/' },
    });
    mockSave.mockRestore();
  });

  it('when I use getBanners to get main banner,should return the main shop marked',
    async () => {
      const mockSave = database.HomeSetupRegions.findAll.mockImplementation(
        () => (resultSetMainShop),
      );
      const response = await getBanners({ query: { lat: 1.000001, lng: 2.200002 } }, true);
      expect(response).toEqual({
        statusCode: 200,
        data: { banners: resultSetMainShop, bucket_url: 'https://s3host.teste.com/' },
      });
      mockSave.mockRestore();
    });

  it('when I use getBanners with some error should return a status of error', async () => {
    const mockSave = database.HomeSetupRegions.findAll.mockImplementation(
      () => { throw new Error('Some error'); },
    );
    const response = await getBanners({ query: { lat: 1.000001, lng: 2.200002 } });
    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
  });
});
