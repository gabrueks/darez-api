const CompanyClients = require('../company_clients');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    CompanyClients: {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Unit Test: Company Clients Repository', () => {
  it('when I call create should create a new client to company', async () => {
    const mockSave = database.CompanyClients.create.mockImplementation(() => (
      { dataValues: { id: 1 } }));

    const companyClients = new CompanyClients(database);
    await companyClients.create({
      name: 'name', phone_country_code: '55', phone_area_code: '11', phone_number: '912345678',
    }, 1);

    expect(database.CompanyClients.create).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyClients.create.mockImplementation(() => { throw new Error('Some error'); });

    const companyClients = new CompanyClients(database);
    try {
      await companyClients.create({
        name: 'name', phone_country_code: '55', phone_area_code: '11', phone_number: '912345678',
      }, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call getOne should return client information', async () => {
    const mockSave = database.CompanyClients.findOne.mockImplementation(() => ({
      id: 1,
      company_id: 1,
      name: 'New name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      email: null,
    }));

    const companyClients = new CompanyClients(database);
    const client = await companyClients.getOne(1, 1, ['id', 'company_id', 'name', 'phone_country_code', 'phone_area_code', 'phone_number', 'email']);

    expect(database.CompanyClients.findOne).toHaveBeenCalledTimes(1);
    expect(client).toEqual({
      id: 1,
      company_id: 1,
      name: 'New name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      email: null,
    });

    mockSave.mockRestore();
  });

  it('when I call getOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyClients.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyClients = new CompanyClients(database);
    try {
      await companyClients.getOne(1, 1, ['id', 'company_id', 'name', 'phone_country_code', 'phone_area_code', 'phone_number', 'email']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  // #################################

  it('when I call getAllCompany should return client information', async () => {
    const mockSave = database.CompanyClients.findAll.mockImplementation(() => [{
      id: 1,
      company_id: 1,
      name: 'New name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      email: null,
    }]);

    const companyClients = new CompanyClients(database);
    const client = await companyClients.getAllCompany(1, ['id', 'company_id', 'name', 'phone_country_code', 'phone_area_code', 'phone_number', 'email']);

    expect(database.CompanyClients.findAll).toHaveBeenCalledTimes(1);
    expect(client).toEqual([{
      id: 1,
      company_id: 1,
      name: 'New name',
      phone_country_code: '55',
      phone_area_code: '11',
      phone_number: '912345678',
      email: null,
    }]);

    mockSave.mockRestore();
  });

  it('when I call getAllCompany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyClients.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companyClients = new CompanyClients(database);
    try {
      await companyClients.getAllCompany(1, ['id', 'company_id', 'name', 'phone_country_code', 'phone_area_code', 'phone_number', 'email']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update a client', async () => {
    const mockSave = database.CompanyClients.update.mockImplementation(() => (0));

    const companyClients = new CompanyClients(database);
    await companyClients.update({ name: 'New Name' }, 1, 1);

    expect(database.CompanyClients.update).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanyClients.update.mockImplementation(() => { throw new Error('Some error'); });

    const companyClients = new CompanyClients(database);
    try {
      await companyClients.update({ name: 'New Name' }, 1, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
