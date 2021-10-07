module.exports = {
  httpRequest: (req) => ({
    body: req.body,
    headers: req.headers,
    params: req.params,
    query: req.query,
    files: req.files,
    file: req.file,
    userId: req.userId,
    companyId: req.companyId,
  }),
  httpResponse: (statusCode, data = {}) => ({
    statusCode, data,
  }),
};
