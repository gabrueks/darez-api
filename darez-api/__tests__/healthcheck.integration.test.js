const request = require('supertest');
const app = require('../application');
const sequelize = require('../infrastructure/database/models');

jest.mock('../web/v1/slack', () => ({
  toSlack: jest.fn(),
}));

jest.mock('../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

describe('GET /v1/', () => {
  let server;

  beforeAll(async () => {
    server = await app();
  });

  afterAll(async () => {
    await sequelize.sequelize.close();
    await server.close();
  });

  it('should return status 200 to healthcheck', async () => {
    const response = await request(server).get('/v1/').send();
    expect(response.status).toEqual(200);
  });
});
