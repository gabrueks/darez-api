const OrderRepository = require('../order');

const { database } = require('../../adapters/database');

jest.mock('../../adapters/database', () => ({
  database: {
    Sequelize: {
      literal: jest.fn(() => ({})),
      fn: jest.fn(() => ({})),
      col: jest.fn(() => ({})),
    },
    Order: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    },
  },
}));

const createData = {
  company_id: 1,
  buyer: 25,
  cep: '00000000',
  street: 'rua Testes',
  street_number: 1,
  address_2: 'ap 0',
  neighborhood: 'Testolandia',
  city: 'Testenopolis',
  state: 'Testos',
  payment_method: 'credito',
  price: 1000,
};

const databaseReturnedData = {
  status: 'Solicitado',
  buyer: 1,
  cep: '00000000',
  street: 'rua Testes',
  street_number: 1,
  address_2: 'ap 0',
  neighborhood: 'Testolandia',
  city: 'Testenopolis',
  state: 'Testos',
  payment_method: 'credito',
  price: 1000,
  quantity: 1,
  name: 'produto',
  description: 'descricao',
  category: 'categoria',
  subcategory: 'subcategoria',
};

const databaseReturnedDataAll = [{
  id: 1,
  buyer: 2,
  company_id: 1,
  state: 'state',
  city: 'city',
  street: 'street',
  street_number: 0,
  address_2: 'address2',
  cep: '00000000',
  neighborhood: 'neighborhood',
  payment_method: 'credit',
  price: 100,
  status: 'created',
  change: 0.00,
  created_at: '2020-10-01T14:24:45.000Z',
  updated_at: '2020-10-01T14:24:45.000Z',
  Company: {
    fantasy_name: 'company name',
  },
  OrderProducts: [
    {
      dataValues: {
        id: 1,
        quantity: 1,
        name: 'nome',
        description: 'descricao',
        category: 'categoria',
        subcategory: 'subcategoria',
        product_id: 1,
        product_variation_id: 1,
        color: 'vermelho',
        size: 'pp',
        Product: {
          ProductPhotos: [{ photo_key: 'photo_key' }],
        },
      },
    },
  ],
}];

const databaseReturnedDataAllCompanies = [{
  id: 1,
  buyer: 2,
  company_id: 1,
  state: 'state',
  city: 'city',
  street: 'street',
  street_number: 0,
  address_2: 'address2',
  cep: '00000000',
  neighborhood: 'neighborhood',
  payment_method: 'credit',
  price: 100,
  status: 'created',
  change: 0.00,
  created_at: '2020-10-01T14:24:45.000Z',
  updated_at: '2020-10-01T14:24:45.000Z',
  OrderProducts: [
    {
      dataValues: {
        id: 1,
        quantity: 1,
        name: 'nome',
        description: 'descricao',
        category: 'categoria',
        subcategory: 'subcategoria',
        product_id: 1,
        product_variation_id: 1,
        color: 'vermelho',
        size: 'pp',
        Product: {
          ProductPhotos: [{ photo_key: 'photo_key' }],
        },
      },
    },
  ],
}];

const databaseExpectedDataAll = [{
  id: 1,
  buyer: 2,
  company_id: 1,
  state: 'state',
  city: 'city',
  street: 'street',
  street_number: 0,
  address_2: 'address2',
  cep: '00000000',
  neighborhood: 'neighborhood',
  payment_method: 'credit',
  price: 100,
  status: 'created',
  change: 0.00,
  company: 'company name',
  created_at: '2020-10-01T14:24:45.000Z',
  updated_at: '2020-10-01T14:24:45.000Z',
  order_products: [
    {
      id: 1,
      quantity: 1,
      name: 'nome',
      description: 'descricao',
      category: 'categoria',
      subcategory: 'subcategoria',
      product_id: 1,
      product_variation_id: 1,
      color: 'vermelho',
      size: 'pp',
      photo_key: 'photo_key',
    },
  ],
}];

const databaseExpectedDataAllCompanies = [{
  id: 1,
  buyer: 2,
  company_id: 1,
  state: 'state',
  city: 'city',
  street: 'street',
  street_number: 0,
  address_2: 'address2',
  cep: '00000000',
  neighborhood: 'neighborhood',
  payment_method: 'credit',
  price: 100,
  status: 'created',
  change: 0.00,
  created_at: '2020-10-01T14:24:45.000Z',
  updated_at: '2020-10-01T14:24:45.000Z',
  order_products: [
    {
      id: 1,
      quantity: 1,
      name: 'nome',
      description: 'descricao',
      category: 'categoria',
      subcategory: 'subcategoria',
      product_id: 1,
      product_variation_id: 1,
      color: 'vermelho',
      size: 'pp',
      photo_key: 'photo_key',
    },
  ],
}];

describe('Unit Test: Order Repository', () => {
  it('when I call create then should create an order and return his data', async () => {
    const mockSave = database.Order.create.mockImplementation(() => (
      { dataValues: databaseReturnedData }
    ));

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.create(createData);

    expect(order).toEqual({ dataValues: databaseReturnedData });
    mockSave.mockRestore();
  });

  it('when I call create and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.create.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.create(createData);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call update then should update an order and return his data', async () => {
    const mockSave = database.Order.update.mockImplementation(() => [1]);

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.update(1, { field: 'something' });

    expect(order).toEqual([1]);
    mockSave.mockRestore();
  });

  it('when I call update and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.update.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.update(1, { field: 'something' });
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany then should return all orders from a company', async () => {
    const mockSave = database.Order.findAll
      .mockImplementation(() => (databaseReturnedDataAllCompanies));

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.findAllFromCompany({ page: 0, pageSize: 20 }, 1);

    expect(order).toEqual(databaseExpectedDataAllCompanies);
    mockSave.mockRestore();
  });

  it('when I call findAllFromCompany and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.findAllFromCompany({ page: 0, pageSize: 20 }, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllFromUser then should return all orders from a user', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => (databaseReturnedDataAll));

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.findAllFromUser({ page: 0, pageSize: 1 }, 1, ['id']);

    expect(order).toEqual(databaseExpectedDataAll);
    mockSave.mockRestore();
  });

  it('when I call findAllFromUser and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.findAllFromUser({ page: 0, pageSize: 1 }, 1, ['id']);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findOne then should return all orders from a user', async () => {
    const mockSave = database.Order.findOne.mockImplementation(() => databaseReturnedData);

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.findOne(1);

    expect(order).toEqual(databaseReturnedData);
    mockSave.mockRestore();
  });

  it('when I call findOne and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.findOne(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call countTotal then should return how many orders a company has', async () => {
    const mockSave = database.Order.findOne.mockImplementation(() => ({ total_orders: 2 }));

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.countTotal(1);

    expect(order).toEqual({ total_orders: 2 });
    mockSave.mockRestore();
  });

  it('when I call countTotal and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.findOne.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.countTotal(1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });

  it('when I call findAllDateRange then should return all orders from an user inside date range', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => [
      {
        id: 'order_id',
        company_id: 10,
        price: '50.00',
        payment_method: 'Dinheiro',
        status: 'Solicitado',
        created_at: '2020-10-28T20:00:45.000Z',
      }]);

    const orderRepository = new OrderRepository(database);
    const order = await orderRepository.findAllDateRange({ initial: '2020-10-11 00:01:00', end: '2020-11-11 00:01:00' }, 1);

    expect(order).toEqual([
      {
        id: 'order_id',
        company_id: 10,
        price: '50.00',
        payment_method: 'Dinheiro',
        status: 'Solicitado',
        created_at: '2020-10-28T20:00:45.000Z',
      }]);
    mockSave.mockRestore();
  });

  it('when I call findAllDateRange and some exception occurs then should throw an exception', async () => {
    const mockSave = database.Order.findAll.mockImplementation(() => { throw new Error('Some error'); });

    const orderRepository = new OrderRepository(database);
    try {
      await orderRepository.findAllDateRange({ initial: '2020-10-11 00:01:00', end: '2020-11-11 00:01:00' }, 1);
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
    mockSave.mockRestore();
  });
});
