const { getShopHours } = require('../getShopHours');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    Sequelize:
    {
      literal: jest.fn(() => ({})),
    },
    BusinessHours: {
      findOne: jest.fn(),
    },
  },
}));

jest.mock('../../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../slack', () => ({
  toSlack: jest.fn(),
}));

const dateHours = {
  company_id: 1,
  monday_open: '11:00:00',
  monday_close: '15:00:00',
  thusday_open: '11:00:00',
  thusday_close: '15:00:00',
  wednesday_open: '11:00:00',
  wednesday_close: '15:00:00',
  thursday_open: '11:00:00',
  thursday_close: '15:00:00',
  friday_open: '11:00:00',
  friday_close: '15:00:00',
  saturday_open: '11:00:00',
  saturday_close: '15:00:00',
  sunday_open: '11:00:00',
  sunday_close: '15:00:00',
  active: 1,
  created_at: '2020-08-21 18:02:04',
  updated_at: '2020-08-21 18:02:04',
};

describe('Unit Test: businessHours/getShopHours', () => {
  it('when I use getShopHours with ID and DATETIME with an open time should return that the shop is open', async () => {
    const mockSave = database.BusinessHours.findOne.mockImplementation(() => dateHours);
    const DATETIME = '2020-10-15T14:54:23.841Z';
    const response = await getShopHours({ params: { ID: 1 }, query: { DATETIME } });
    expect(response).toEqual({
      statusCode: 200,
      data: {
        shop_open: true,
      },
    });
    mockSave.mockRestore();
  });

  it('when I use getShopHours with ID and DATETIME with a close time should return that the shop is close', async () => {
    const mockSave = database.BusinessHours.findOne.mockImplementation(() => dateHours);
    const DATETIME = '2020-10-15T20:54:23.841Z';
    const response = await getShopHours({ params: { ID: 1 }, query: { DATETIME } });
    expect(response).toEqual({
      statusCode: 200,
      data: {
        shop_open: false,
      },
    });
    mockSave.mockRestore();
  });

  it('when I use getShopHours with some error should return an error', async () => {
    const response = await getShopHours({});

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });
  });
});
