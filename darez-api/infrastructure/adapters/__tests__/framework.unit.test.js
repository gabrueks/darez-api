const {
  initialize, getApplication, setupMiddlewares, setupRoutes,
} = require('../framework');

const application = {
  use: jest.fn(),
  listen: jest.fn(),
};

describe('Unit Test: Framework Adapter', () => {
  it('when I call getApplication method then should return express instance', async () => {
    const app = getApplication();
    expect(app).toHaveProperty('use');
    expect(app).toHaveProperty('listen');
  });

  it('when I call setupMiddlewares without any then express framework use method should not be called', async () => {
    await setupMiddlewares(application, []);
    expect(application.use).toHaveBeenCalledTimes(0);
  });

  it('when I call setupMiddlewares then express framework use method should be called', async () => {
    await setupMiddlewares(application, [() => () => {}]);
    expect(application.use).toHaveBeenCalledTimes(1);
  });

  it('when I call setupRoutes without any then express framework use method should not be called', async () => {
    await setupRoutes(application, []);
    expect(application.use).toHaveBeenCalledTimes(0);
  });

  it('when I call setupRoutes then express framework use method should be called', async () => {
    await setupRoutes(application, [() => () => {}]);
    expect(application.use).toHaveBeenCalledTimes(1);
  });

  it('when I call initialize then express framework listen method should be called', () => {
    initialize(application);
    expect(application.listen).toHaveBeenCalledTimes(1);
  });
});
