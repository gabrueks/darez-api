const algoliasearch = require('algoliasearch');

const {
  ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_API_KEY,
} = process.env;

module.exports = {
  client: algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY),
};
