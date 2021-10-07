jest.mock('fs');
const CompanyRepository = require('../company');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Company: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

const databaseReturnedData = {
  delivery_range: 5,
  id: 2,
  user_id: 1,
  document: '012312312344',
  fantasy_name: 'Lojinha do Deco',
  cep: '01231010',
  street: 'Street',
  street_number: 200,
  address_2: null,
  neighborhood: 'Neighborhood',
  city: 'City',
  state: 'State',
  latitude: -23.5343714,
  longitude: -46.6590984,
};

const databaseReturnedDataIdDoc = [{
  id: 5,
  document: '28885225861',
}];

const databaseReturnedDataId = [{
  id: 5,
}];

const databaseReturnedDataAll = [{
  id: 5,
  user_id: 1,
  document: '28885225861',
  fantasy_name: 'loja da lele',
  cep: '05414010',
  street: 'rua conego eugenio leite',
  street_number: 76,
  address_2: '',
  neighborhood: 'pinheiros',
  city: 'sao paulo',
  state: 'SP',
  delivery_range: 5,
  latitude: -23.56694,
  longitude: -46.677212,
  active: true,
  created_at: '2020-07-29T15:36:53.000Z',
  updated_at: '2020-07-29T15:36:53.000Z',
}];

const databaseReturnedDataAllMap = [{
  id: 5,
  user_id: 1,
  document: '28885225861',
  fantasy_name: 'loja da lele',
  cep: '05414010',
  street: 'rua conego eugenio leite',
  street_number: 76,
  address_2: '',
  neighborhood: 'pinheiros',
  city: 'sao paulo',
  state: 'SP',
  delivery_range: 5,
  latitude: -23.56694,
  longitude: -46.677212,
  active: true,
  banner: 'banner',
  logo: 'logo',
  distance: 0,
}];
const databaseReturnedFromRegion = [{
  id: 5,
  user_id: 1,
  street: 'rua conego eugenio leite',
  street_number: 76,
  cep: '05414010',
  state: 'SP',
  city: 'sao paulo',
  fantasy_name: 'loja da lele',
  address_2: '',
  delivery_range: 5,
  distance: 0,
}];

const databaseReturnedNeighborhood = [{
  city: ['Neighborhood'],
}];

describe('Unit Test: CompanyRepository', () => {
  it('when I call create then should create a company and return his data', async () => {
    const mockSave = database.Company.create.mockImplementation(() => (
      { dataValues: databaseReturnedData }
    ));

    const companyRepository = new CompanyRepository(database);
    const { dataValues } = await companyRepository.create({
      id: 2,
      user_id: 1,
      document: '012312312344',
      fantasy_name: 'Lojinha do Deco',
      cep: '01231010',
      street: 'Street',
      street_number: 200,
      address_2: null,
      neighborhood: 'Neighborhood',
      city: 'City',
      state: 'State',
      latitude: -23.5343714,
      longitude: -46.6590984,
      phone: { countryCode: '55', areaCode: '11', number: '912345678' },
      endpoint: 'some-end-point',
    });

    expect(dataValues).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.create.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);

    try {
      await companyRepository.create({
        id: 2,
        user_id: 1,
        document: '012312312344',
        fantasy_name: 'Lojinha do Deco',
        cep: '01231010',
        street: 'Street',
        street_number: 200,
        address_2: null,
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'State',
        latitude: -23.5343714,
        longitude: -46.6590984,
        phone: { countryCode: '55', areaCode: '11', number: '912345678' },
        endpoint: 'some-end-point',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAll with more then 1 filter element then should return json data with chosen info', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (databaseReturnedDataIdDoc));

    const companyRepository = new CompanyRepository(database);
    const r1 = await companyRepository.findAll({
      page: '1',
      pageSize: '1',
      field: ['id', 'document'],
    });
    expect(r1).toEqual(databaseReturnedDataIdDoc);
    mockSave.mockRestore();
  });

  it('when I call findAll one filter element then should return json data with one chosen info', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (databaseReturnedDataId));

    const companyRepository = new CompanyRepository(database);
    const r2 = await companyRepository.findAll({
      page: '1',
      pageSize: '1',
      field: 'id',
    });
    expect(r2).toEqual(databaseReturnedDataId);
    mockSave.mockRestore();
  });

  it('when I call findAll with no filter element then should return json data with all info', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (databaseReturnedDataAll));

    const companyRepository = new CompanyRepository(database);
    const r3 = await companyRepository.findAll({
      page: '1',
      pageSize: '1',
    });
    expect(r3).toEqual(databaseReturnedDataAll);
    mockSave.mockRestore();
  });

  it('when I call findAllRegion should return all companies in a range', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (
      databaseReturnedFromRegion));

    const companyRepository = new CompanyRepository(database);
    const r3 = await companyRepository.findAllRegion(0, 1, {
      lat: -23.56694,
      lng: -46.6590984,
    });
    expect(r3).toEqual(databaseReturnedFromRegion);
    mockSave.mockRestore();
  });

  it('when I call findAllRegion and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findAllRegion(0, 1, {
        lat: -23.56694,
        lng: -46.6590984,
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllNeighborhoods should return all neighbors in the database', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (
      databaseReturnedNeighborhood));

    const companyRepository = new CompanyRepository(database);
    const r3 = await companyRepository.findAllNeighborhoods();
    expect(r3).toEqual(databaseReturnedNeighborhood);
    mockSave.mockRestore();
  });

  it('when I call findAllNeighborhoods and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findAllNeighborhoods();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update and return the updated value', async () => {
    const mockupdateSave = database.Company.update.mockImplementation(() => (
      { dataValues: databaseReturnedData }));
    const mockfindOneSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnedData));

    const companyRepository = new CompanyRepository(database);
    const { dataValues } = await companyRepository.update({
      id: 2,
      user_id: 1,
      document: '012312312344',
      fantasy_name: 'Lojinha do Deco',
      cep: '01231010',
      street: 'Street',
      street_number: 200,
      address_2: null,
      neighborhood: 'Neighborhood',
      city: 'City',
      state: 'State',
      latitude: -23.5343714,
      longitude: -46.6590984,
      phone: { countryCode: '55', areaCode: '11', number: '912345678' },
      creator: 'Creator',
    });

    expect(dataValues).toEqual(databaseReturnedData);
    mockupdateSave.mockRestore();
    mockfindOneSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockupdateSave = database.Company.update.mockImplementation(() => { throw new Error('Some error'); });
    const mockfindOneSave = database.Company.findOne.mockImplementation(() => (
      databaseReturnedData));

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.update({
        id: 2,
        user_id: 1,
        document: '012312312344',
        fantasy_name: 'Lojinha do Deco',
        cep: '01231010',
        street: 'Street',
        street_number: 200,
        address_2: null,
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'State',
        latitude: -23.5343714,
        longitude: -46.6590984,
        phone: { countryCode: '55', areaCode: '11', number: '912345678' },
        creator: 'Creator',
      });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockupdateSave.mockRestore();
    mockfindOneSave.mockRestore();
  });

  it('when I call findUserLoginCode should find a single user confirmation code and its fullname', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (
      { User: { confirmation_code: 123, full_name: 'nome completo' } }));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findUserLoginCode(1);

    expect(result).toEqual({ User: { confirmation_code: 123, full_name: 'nome completo' } });
    mockSave.mockRestore();
  });

  it('when I call findUserLoginCode and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findUserLoginCode(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call updateBannerOrLogo to update a banner should update the banner value', async () => {
    const companyRepository = new CompanyRepository(database);
    await companyRepository.updateBannerOrLogo(1, true, 'key');
    expect(database.Company.update).toHaveBeenCalledTimes(1);
  });

  it('when I call updateBannerOrLogo to update a logo should update the logo value', async () => {
    const companyRepository = new CompanyRepository(database);
    await companyRepository.updateBannerOrLogo(1, false, 'key');
    expect(database.Company.update).toHaveBeenCalledTimes(1);
  });

  it('when I call updateBannerOrLogo and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.update.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.updateBannerOrLogo(1, true, 'key');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOne should return the desired attributes of a specific company', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => (databaseReturnedDataId));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findOne(['id'], 1);
    expect(result).toEqual(databaseReturnedDataId);
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findOne();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findLastEndpoint should return the the last added company endpoint', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ endpoint: 'some-endpoint' }));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findLastEndpoint('some-endpoint');
    expect(result).toEqual({ endpoint: 'some-endpoint' });
    mockSave.mockRestore();
  });

  it('when I call findLastEndpoint and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findLastEndpoint();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOneByUser should return the company id of a given user', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ id: 1 }));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findOneByUser(1);
    expect(result).toEqual({ id: 1 });
    mockSave.mockRestore();
  });

  it('when I call findOneByUser and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findOneByUser();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOneEndpoint should return the company info using the endpoint as filter', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => ({ id: 1 }));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findOneEndpoint(['id'], 'url');
    expect(result).toEqual({ id: 1 });
    mockSave.mockRestore();
  });

  it('when I call findOneEndpoint and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findOneEndpoint(['id'], 'url');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findEndpoints should return all endpoint', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => ([{ endpoint: 'endpoint' }]));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findEndpoints();
    expect(result).toEqual([{ endpoint: 'endpoint' }]);
    mockSave.mockRestore();
  });

  it('when I call findEndpoints and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findEndpoints();
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllRegionMap should return the company info using the endpoint as filter', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => (
      databaseReturnedDataAllMap
    ));

    const companyRepository = new CompanyRepository(database);
    const result = await companyRepository.findAllRegionMap(
      0, 1, { query: { lng: -46.677212, lat: -23.56694 } }, 5,
    );
    expect(result).toEqual(databaseReturnedDataAllMap);
    mockSave.mockRestore();
  });

  it('when I call findAllRegionMap and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Company.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companyRepository = new CompanyRepository(database);
    try {
      await companyRepository.findAllRegionMap(
        0, 1, { query: { lng: -46.677212, lat: -23.56694 } }, 5,
      );
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
