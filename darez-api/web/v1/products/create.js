const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { toSlack } = require('../slack');
const { findNewSort, throwError, findCreator } = require('../helpers');

const ProductRepository = require('../../../infrastructure/repositories/product');
const ProductVariationRepository = require('../../../infrastructure/repositories/product_variation');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');

const { slackChannel: { SLACK_PRODUCTS } } = require('../helpers/strings');

const productRepository = new ProductRepository(database);
const productVariationRepository = new ProductVariationRepository(database);
const companyRepository = new CompanyRepository(database);
const transactionRepository = new TransactionRepository(database);

module.exports = {
  create: async ({ body, companyId }) => {
    const f = async (transaction) => {
      const creator = await findCreator(companyId, false, transaction);
      const { fantasy_name: fantasyName } = await companyRepository.findOne(['fantasy_name'], companyId, transaction);
      const { dataValues } = await productRepository.create(
        { ...body, company_id: companyId, created_by: creator }, transaction,
      );
      const productId = dataValues.id;
      if (body.variations) {
        await Promise.all(body.variations.map(async (variation) => {
          await productVariationRepository.create({
            productId,
            color: variation.color,
            size: variation.size,
          }, transaction);
        }));
        toSlack(SLACK_PRODUCTS, `Novo produto: ${body.name}\nLoja: ${fantasyName}\nCriador: ${creator}`);
      }
      const newSortId = await findNewSort(companyId, transaction);
      await productRepository.update(productId, { sort_id: newSortId }, transaction);
      return httpResponse(201, { product_id: productId });
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      return throwError(err, 'products/create');
    }
  },
};
