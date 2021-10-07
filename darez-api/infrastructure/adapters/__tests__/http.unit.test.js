const { httpRequest, httpResponse } = require('../http');

describe('Unit Test: Http Adapter', () => {
  it('when I call httpRequest with filled req data then it should return an object with body and headers', async () => {
    const request = httpRequest({
      body: {}, headers: {}, params: {}, query: {}, files: {}, file: {}, userId: 1, companyId: 1,
    });
    expect(request).toHaveProperty('body');
    expect(request).toHaveProperty('headers');
    expect(request).toHaveProperty('params');
    expect(request).toHaveProperty('query');
    expect(request).toHaveProperty('files');
    expect(request).toHaveProperty('file');
    expect(request).toHaveProperty('userId');
    expect(request).toHaveProperty('companyId');
  });

  it('when I call httpResponse with certain statusCode and data then should return these values as object', async () => {
    const response = httpResponse(200, { some: 'data' });
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('data');
  });
});
