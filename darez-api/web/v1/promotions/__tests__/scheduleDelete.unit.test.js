const { scheduleDelete } = require('../scheduleDelete');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Product: {
      update: jest.fn(),
    },
    Promotion: {
      findAll: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

describe('Unit Test: promotions/scheduleDelete', () => {
  it('when I call scheduleDelete should delete dated promotion logically', async () => {
    const mockSave = database.Product.update.mockImplementation(() => [1]);
    const mockSavePromotion = database.Promotion.findAll.mockImplementation(() => [
      { id: 1 }]);
    const mockSavePromoUpdate = database.Promotion.update.mockImplementation(() => [1]);
    const response = await scheduleDelete();

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });
    mockSave.mockRestore();
    mockSavePromotion.mockRestore();
    mockSavePromoUpdate.mockRestore();
  });

  it('when I call scheduleDelete with some error should return a status of error', async () => {
    const mockSave = database.Product.update.mockImplementation(() => [1]);
    const mockSavePromotion = database.Promotion.findAll.mockImplementation(() => [
      { id: 1 }]);
    const mockSavePromoUpdate = database.Promotion.update.mockImplementation(() => {
      throw new Error('Some error');
    });
    const response = await scheduleDelete();

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
    mockSave.mockRestore();
    mockSavePromotion.mockRestore();
    mockSavePromoUpdate.mockRestore();
  });
});
