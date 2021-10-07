const Boom = require('@hapi/boom');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');

const companyRepository = new CompanyRepository(database);

module.exports = async (fantasyName, transaction) => {
  try {
    const newEndpoint = fantasyName.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '');
    const endpoint = await companyRepository.findLastEndpoint(newEndpoint, transaction);
    if (endpoint) {
      const splitedName = endpoint.endpoint.split('-');
      /* eslint-disable */
      return (!isNaN(splitedName[splitedName.length - 1]))
        ? `${newEndpoint}-${parseInt(splitedName[splitedName.length - 1]) + 1}`
        : `${newEndpoint}-2`;
    }
    return newEndpoint;
  } catch (error) {
    throw Boom.internal(error.message);
  }
};
