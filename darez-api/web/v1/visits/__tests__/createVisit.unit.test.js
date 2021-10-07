const moment = require('moment-timezone');
const { createVisit } = require('../createVisit');
const { database } = require('../../../../infrastructure/adapters/database');

jest.mock('../../../../infrastructure/adapters/database', () => ({
  database: {
    CompanyVisit: {
      findOne: jest.fn(),
      create: jest.fn(),
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

describe('Unit Test: visit/createVisit', () => {
  it('when I use createVisit with a new ip should create a new visit to a company', async () => {
    const mockSave = database.CompanyVisit.findOne.mockImplementation(() => null);

    const response = await createVisit({
      headers: { ipv4: '192.168.0.1' },
      body: { companyId: 1 },
    });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I use createVisit with a revisiting ip should create a new visit to a company with more than 3 minutes since last time', async () => {
    const mockSave = database.CompanyVisit.findOne.mockImplementation(() => ({ created_at: '2020-01-01T20:00:12.000Z' }));

    const response = await createVisit({
      headers: { ipv4: '192.168.0.1' },
      body: { companyId: 1 },
    });

    expect(response).toEqual({
      statusCode: 201,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I use createVisit with a revisiting ip should create a new visit to a company with less than 3 minutes since last time', async () => {
    const mockSave = database.CompanyVisit.findOne.mockImplementation(() => (
      { created_at: moment().tz('America/Sao_Paulo').toISOString() }));

    const response = await createVisit({
      headers: { ipv4: '192.168.0.1' },
      body: { companyId: 1 },
    });

    expect(response).toEqual({
      statusCode: 204,
      data: {},
    });

    mockSave.mockRestore();
  });

  it('when I use createVisit with some error should return a status of error', async () => {
    const mockSave = database.CompanyVisit.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const response = await createVisit({
      headers: { ipv4: '192.168.0.1' },
      body: { companyId: 1 },
    });

    expect(response).toEqual({
      statusCode: 500,
      data: {},
    });

    mockSave.mockRestore();
  });
});
