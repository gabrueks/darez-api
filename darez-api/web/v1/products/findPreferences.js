const moment = require('moment-timezone');
const axios = require('axios').default;
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const ProductRepository = require('../../../infrastructure/repositories/product');
const { toSlack } = require('../slack');

const {
  AWS_BUCK_URL,
  ANLY_SVC_URL,
} = process.env;

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productRepository = new ProductRepository(database);

const createResult = async (catInfo, timeString, query, page, pageSize) => ((catInfo) ? {
  products: await productRepository.findAllPreferences(
    catInfo.name, timeString, query, page, pageSize,
  ),
  category: catInfo.name,
  count: catInfo.count,
} : null);

module.exports = {
  findPreferences: async ({ userId, headers, query }) => {
    try {
      const { page, pageSize } = !(query.page && query.pageSize)
        ? { page: 0, pageSize: 2000 } : query;
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      const token = (headers.authorization.substring(0, 6) === 'Bearer')
        ? headers.authorization.split(' ')[1] : headers.authorization;
      const { data: preferences } = await axios.get(`${ANLY_SVC_URL}/user/visit/categories?userId=${userId}`,
        {
          headers: {
            authorization: `Bearer _${token}`,
          },
        });
      const result = {
        recent: {
          product_page: await createResult(
            preferences.recent.catProd, timeString, query, page, pageSize,
          ),
          category_page: await createResult(
            preferences.recent.catPage, timeString, query, page, pageSize,
          ),
        },
        total: {
          product_page: await createResult(
            preferences.total.catProd, timeString, query, page, pageSize,
          ),
          category_page: await createResult(
            preferences.total.catPage, timeString, query, page, pageSize,
          ),
        },
      };
      result.bucket_url = AWS_BUCK_URL;
      return httpResponse(200, result);
    } catch (error) {
      toSlack(SLACK_ERR, error, 'products/findPreferences');
      return httpResponse(500);
    }
  },
};
