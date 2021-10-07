const Boom = require('@hapi/boom');
const { database } = require('../../../infrastructure/adapters/database');
const UserAddressRepository = require('../../../infrastructure/repositories/user_address');
const coordinates = require('../../../infrastructure/implementations/coordinates');

const userAddressRepository = new UserAddressRepository(database);

// transaction
module.exports = async (address, userId, transaction) => {
  try {
    const { latitude, longitude } = await coordinates({ ...address });
    return await userAddressRepository.create(
      { latitude, longitude, ...address },
      userId, transaction,
    );
  } catch (error) {
    throw Boom.internal(error.message);
  }
};
