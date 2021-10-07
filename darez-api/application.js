const {
  initialize, getApplication, setupMiddlewares, setupRoutes,
} = require('./infrastructure/adapters/framework');
const { setupDatabaseConnection } = require('./infrastructure/adapters/database');
const { premiddleware, error: errorMiddleware } = require('./interfaces/http/middlewares');
const routes = require('./interfaces/http/routes');

const application = getApplication();

module.exports = async () => {
  await setupDatabaseConnection();
  await setupMiddlewares(application, premiddleware);
  await setupRoutes(application, routes);
  return initialize(application, errorMiddleware);
};
