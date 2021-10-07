const express = require('express');

const useMiddleware = (application, middleware) => application.use(middleware);
const useRoute = (application, route) => application.use('/v1', route);

module.exports = {
  getApplication: () => express(),
  setupMiddlewares: async (application, middlewares) => {
    if (middlewares) {
      middlewares.map((middleware) => useMiddleware(application, middleware));
    }
  },
  setupRoutes: async (application, routes) => {
    if (routes) {
      routes.map((route) => useRoute(application, route));
    }
  },
  initialize: (application, errorMiddleware) => {
    application.use(errorMiddleware);
    return application.listen(8000, () => {
      // eslint-disable-next-line no-console
      console.log('Listening on port 8000');
    });
  },
};
