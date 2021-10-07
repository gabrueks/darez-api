const premiddleware = require('./premiddlewares');
const error = require('./error');
const validate = require('./validator');
const upload = require('./upload_file');
const auth = require('./auth');
const base64validate = require('./base64validator');
const resizeImageMiddleware = require('./resizeImage');

module.exports = {
  premiddleware,
  ...error,
  ...validate,
  ...upload,
  ...auth,
  ...base64validate,
  ...resizeImageMiddleware,
};
