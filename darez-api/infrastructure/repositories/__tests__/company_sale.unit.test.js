const CompanySales = require('../company_sales');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    CompanySales: {
      bulkCreate: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
    sequelize: {
      query: jest.fn(),
    },
  },
}));

jest.mock('../../../infrastructure/adapters/twilio', () => ({
  twilioClient: {
    messages: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../web/v1/slack', () => ({
  toSlack: jest.fn(),
}));

const findOneResponse = {
  client_id: 1,
  price: 10.00,
  description: 'description',
  sale_time: '2010-10-10 10:10:100Z',
  payment_method: 'DINHEIRO',
  client_name: 'Gabriel Bolzi',
};

describe('Unit Test: Company Sales Repository', () => {
  it('when I call create should create a new sale to company', async () => {
    const mockSave = database.CompanySales.bulkCreate.mockImplementation(() => (0));

    const companySales = new CompanySales(database);
    await companySales.create([{
      company_id: 1,
      description: 'description',
      price: '10.00',
      client_id: 1,
      payment_method: 'DINHEIRO',
      slaes_time: '2010-10-10 10:10:00',
      split_times: 1,
      split_number: 1,
    }]);

    expect(database.CompanySales.bulkCreate).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.bulkCreate.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.create([{
        company_id: 1,
        description: 'description',
        price: '10.00',
        client_id: 1,
        payment_method: 'DINHEIRO',
        slaes_time: '2010-10-10 10:10:00',
        split_times: 1,
        split_number: 1,
      }]);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update should update a sale from company', async () => {
    const mockSave = database.CompanySales.update.mockImplementation(() => (0));

    const companySales = new CompanySales(database);
    await companySales.update({
      description: 'description',
      price: '10.00',
      client_id: 1,
      payment_method: 'DINHEIRO',
      sales_time: '2010-10-10 10:10:00',
    }, 1, 1);

    expect(database.CompanySales.update).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.update.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.update({
        description: 'description',
        price: '10.00',
        client_id: 1,
        payment_method: 'DINHEIRO',
        sales_time: '2010-10-10 10:10:00',
      }, 1, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I use findAll should return all sales information from company', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => [findOneResponse]);

    const companySales = new CompanySales(database);
    const result = companySales.findAll(1);

    expect(result).toEqual([findOneResponse]);

    mockSave.mockRestore();
  });

  it('when I call findAll and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.findAll(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I use findOne should return sale information by id', async () => {
    const mockSave = database.CompanySales.findOne.mockImplementation(() => findOneResponse);

    const companySales = new CompanySales(database);
    const result = companySales.findOne(1, 1);

    expect(result).toEqual(findOneResponse);

    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.findOne(1, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I use findAllDateRange should return all sales information from company in date range', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => [{ ...findOneResponse, 'CompanyClient.name': 'Gabriel Bolzi' }]);

    const companySales = new CompanySales(database);
    const result = await companySales.findAllDateRange(1, '10/10/2010', '10/10/2010');

    expect(result).toEqual([findOneResponse]);

    mockSave.mockRestore();
  });

  it('when I call findAllDateRange and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.findAllDateRange(1, '10/10/2010', '10/10/2010');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call getAllClient should return all sales information from a client', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => [{
      id: 1,
      company_id: 1,
      client_id: 1,
      price: 12.00,
      description: 'Description',
    }]);

    const companySales = new CompanySales(database);
    const result = await companySales.getAllClient(1, 1, ['id', 'company_id', 'client_id', 'price', 'description']);

    expect(result).toEqual([{
      id: 1,
      company_id: 1,
      client_id: 1,
      price: 12.00,
      description: 'Description',
    }]);

    mockSave.mockRestore();
  });

  it('when I call getAllClient and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.getAllClient(1, 1, ['id', 'company_id', 'client_id', 'price', 'description']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findTotalFromRange should return total from each method to a company given a time range', async () => {
    const mockSave = database.sequelize.query.mockImplementation(() => [
      {
        saleMethod: 'Crédito', operator: 1, total: 10, countSaleMethod: 2,
      },
      {
        saleMethod: 'Débito', operator: 1, total: 5, countSaleMethod: 1,
      },
      {
        saleMethod: 'Dinheiro', operator: 1, total: 0, countSaleMethod: '0.00',
      },
      {
        saleMethod: 'Despesa', operator: -1, total: 5, countSaleMethod: 3,
      },
    ]);

    const companySales = new CompanySales(database);
    const result = await companySales.findTotalFromRange(1, '01-02-2021 00:00:00', '20-02-2021 23:59:00');

    expect(result).toEqual([
      {
        saleMethod: 'Crédito', operator: 1, total: 10, countSaleMethod: 2,
      },
      {
        saleMethod: 'Débito', operator: 1, total: 5, countSaleMethod: 1,
      },
      {
        saleMethod: 'Dinheiro', operator: 1, total: 0, countSaleMethod: '0.00',
      },
      {
        saleMethod: 'Despesa', operator: -1, total: 5, countSaleMethod: 3,
      },
    ]);

    mockSave.mockRestore();
  });

  it('when I call findTotalFromRange and some exception occurs then should throw an exception', async () => {
    const mockSave = database.sequelize.query.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.findTotalFromRange(1, '01-02-2021 00:00:00', '20-02-2021 23:59:00');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllDateRangeClient should return all sales information from a company with time range', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => [
      {
        sale_time: '02-01-2021z09:10:00', description: 'Description', sale_method: 'Crédito', price: 10.90, 'CompanyClient.name': 'Client Name', saleTime: '02-01-2021z09:10:00',
      },
      {
        sale_time: '02-02-2021z08:20:00', description: 'Description 2', sale_method: 'Despesa', price: 5.00, 'CompanyClient.name': null, saleTime: '02-02-2021z08:20:00',
      },
      {
        sale_time: '02-03-2021z10:30:00', description: 'Description 3', sale_method: 'Dinheiro', price: 7.99, 'CompanyClient.name': 'New Client', saleTime: '02-03-2021z10:30:00',
      },
    ]);

    const companySales = new CompanySales(database);
    const result = await companySales.findAllDateRangeClient(1, '01-02-2021 00:00:00', '20-02-2021 23:59:00');

    expect(result).toEqual([
      {
        date: '01/02/2021', description: 'Description', type: 'Crédito', price: 10.90, client: 'Client Name', saleTime: '02-01-2021z09:10:00',
      },
      {
        date: '02/02/2021', description: 'Description 2', type: 'Despesa', price: 5.00, client: null, saleTime: '02-02-2021z08:20:00',
      },
      {
        date: '03/02/2021', description: 'Description 3', type: 'Dinheiro', price: 7.99, client: 'New Client', saleTime: '02-03-2021z10:30:00',
      },
    ]);

    mockSave.mockRestore();
  });

  it('when I call findAllDateRangeClient and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.getAllClient(1, '01-02-2021 00:00:00', '20-02-2021 23:59:00');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call deleteOne should logically delete a sale', async () => {
    const mockSave = database.CompanySales.update.mockImplementation(() => (0));

    const companySales = new CompanySales(database);
    await companySales.deleteOne(1, 1);

    expect(database.CompanySales.update).toHaveBeenCalledTimes(1);

    mockSave.mockRestore();
  });

  it('when I call deleteOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.CompanySales.update.mockImplementation(() => { throw new Error('Some error'); });

    const companySales = new CompanySales(database);
    try {
      await companySales.deleteOne(1, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
