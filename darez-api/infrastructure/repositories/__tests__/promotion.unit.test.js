const PromotionRepository = require('../promotion');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Promotion: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

const databaseReturnedDataFindAll = {
  id: 1,
  company_id: 1,
  discount: 10,
  has_limit_date: 1,
  date_start: 'dateStart',
  date_end: 'dateEnd',
  created_by: 'name',
  Products: [{
    id: 1,
    name: 'name',
    quantity: 10,
    description: 'description',
    price: 10.00,
    promotion_price: 9.00,
    category: 'category',
    subcategory: 'subcategory',
    created_by: 'name creator',
    ProductPhotos: [{
      photo_key: 'url',
    }],
  }],
};

const databaseReturnedDataFindAllRegion = {
  id: 1,
  company_id: 1,
  discount: 10,
  has_limit_date: 1,
  date_start: 'dateStart',
  date_end: 'dateEnd',
  created_by: 'name',
  Company: {
    dataValues: {
      distance: 0,
      endpoint: 'url',
    },
  },
  Products: [{
    id: 1,
    name: 'name',
    quantity: 10,
    description: 'description',
    price: 10.00,
    promotion_price: 9.00,
    category: 'category',
    subcategory: 'subcategory',
    created_by: 'name creator',
    ProductPhotos: [{
      photo_key: 'url',
    }],
  }],
};

const databaseReturnedDataFinds = {
  dataValues: {
    id: 1,
    company_id: 1,
    discount: 10,
    has_limit_date: 1,
    date_start: 'dateStart',
    date_end: 'dateEnd',
    created_by: 'name',
    Products: [{
      id: 1,
      name: 'name',
      quantity: 10,
      description: 'description',
      price: 10.00,
      promotion_price: 9.00,
      category: 'category',
      subcategory: 'subcategory',
      created_by: 'name creator',
      ProductPhotos: [{
        photo_key: 'url',
      }],
    }],
  },
};

const resultFinds = {
  id: 1,
  company_id: 1,
  discount: 10,
  has_limit_date: 1,
  date_start: 'dateStart',
  date_end: 'dateEnd',
  created_by: 'name',
  products: [{
    id: 1,
    name: 'name',
    quantity: 10,
    description: 'description',
    price: 10.00,
    promotion_price: 9.00,
    category: 'category',
    subcategory: 'subcategory',
    created_by: 'name creator',
    photo_key: ['url'],
  }],
};

const resultFindsRegion = {
  id: 1,
  company_id: 1,
  discount: 10,
  has_limit_date: 1,
  date_start: 'dateStart',
  date_end: 'dateEnd',
  created_by: 'name',
  distance: 0,
  company_endpoint: 'url',
  products: [{
    id: 1,
    name: 'name',
    quantity: 10,
    description: 'description',
    price: 10.00,
    promotion_price: 9.00,
    category: 'category',
    subcategory: 'subcategory',
    created_by: 'name creator',
    photo_key: ['url'],
  }],
};

const promotionCreate = {
  company_id: 1,
  discount: 10,
  has_limit_date: 1,
  date_start: 'startDate',
  date_end: 'endDate',
  created_by: 'name',
};

const promotionUpdate = {
  company_id: 1,
  discount: 10,
  has_limit_date: 1,
  date_start: 'startDate',
  date_end: 'endDate',
  updated_by: 'name',
};

describe('Unit Test: ProductRepository', () => {
  it('when I call create then should create a promotion and return its data', async () => {
    const mockSave = database.Promotion.create.mockImplementation(() => ({ id: 1 }));

    const promotionRepository = new PromotionRepository(database);
    const product = await promotionRepository.create(promotionCreate);

    expect(product).toEqual({ id: 1 });
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.create.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);

    try {
      await promotionRepository.create(promotionCreate);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOne should return specific attributes from a specific promotion', async () => {
    const mockSave = database.Promotion.findOne.mockImplementation(() => (
      databaseReturnedDataFinds));

    const promotionRepository = new PromotionRepository(database);
    const result = await promotionRepository.findOne(1, 'date');

    expect(result).toEqual(resultFinds);
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);
    try {
      await promotionRepository.findOne(1, 'date');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany should return all active promotions with products information from a specific company', async () => {
    const mockSave = database.Promotion.findAll.mockImplementation(() => [
      databaseReturnedDataFindAll,
    ]);

    const promotionRepository = new PromotionRepository(database);
    const result = await promotionRepository.findAllFromCompany(1, 'date');

    expect(result).toEqual([resultFinds]);
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);
    try {
      await promotionRepository.findAllFromCompany(1, 'date');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllRegion should return all active promotions with products information from a specific region', async () => {
    const mockSave = database.Promotion.findAll.mockImplementation(() => (
      [databaseReturnedDataFindAllRegion]));

    const promotionRepository = new PromotionRepository(database);
    const result = await promotionRepository.findAllRegion(0, 1, 'date', { lat: 1, lng: 0 });

    expect(result).toEqual([resultFindsRegion]);
    mockSave.mockRestore();
  });

  it('when I call findAllRegion and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);
    try {
      await promotionRepository.findAllRegion(0, 1, 'date', { lat: 1, lng: 0 });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update all informations from a specific product', async () => {
    const mockSave = database.Promotion.update.mockImplementation(() => [1]);

    const promotionRepository = new PromotionRepository(database);
    const result = await promotionRepository.update(1, promotionUpdate);

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.update.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);
    try {
      await promotionRepository.update(1, promotionUpdate);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call logicalDelete should inactivate a promotion', async () => {
    const mockSave = database.Promotion.update.mockImplementation(() => [1]);

    const promotionRepository = new PromotionRepository(database);
    const result = await promotionRepository.logicalDelete([1, 2], 'date');

    expect(result).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call logicalDelete and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.update.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);
    try {
      await promotionRepository.logicalDelete([1, 2], 'date');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call scheduleDelete should inactivate dated promotion', async () => {
    const mockSave = database.Promotion.findAll.mockImplementation(() => [{ id: 1 }]);
    const mockSaveup = database.Promotion.update.mockImplementation(() => [1]);

    const promotionRepository = new PromotionRepository(database);
    const result = await promotionRepository.scheduleDelete('date');

    expect(result).toEqual([{ id: 1 }]);
    mockSave.mockRestore();
    mockSaveup.mockRestore();
  });

  it('when I call scheduleDelete and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Promotion.update.mockImplementation(() => { throw new Error('Some error'); });

    const promotionRepository = new PromotionRepository(database);
    try {
      await promotionRepository.scheduleDelete('date');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
