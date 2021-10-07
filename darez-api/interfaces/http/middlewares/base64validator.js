const Boom = require('@hapi/boom');
const fs = require('fs');

const { invalidRequest } = require('../../../web/v1/helpers');

const checkBase64 = ({ file, type }) => new Promise((resolve, reject) => {
  if (
    file instanceof Boolean
      || typeof file === 'boolean'
      || file === ''
  ) {
    reject(invalidRequest);
  }
  const regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?';
  if (new RegExp(`^${regex}$`, 'gi').test(file)) {
    const destination = 'uploads/';
    const filename = `img_${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}${Date.now()}${type}`;
    const path = destination + filename;
    return fs.writeFile(path, file, 'base64', (err) => {
      if (err) reject(invalidRequest);
      resolve({ path, destination, filename });
    });
  }
  return reject(invalidRequest);
});

module.exports = {
  base64validate: async (req, _res, next) => {
    try {
      if (req.body.files) {
        req.files = await Promise.all(req.body.files.map(async (item) => checkBase64(item)));
        return next();
      }
      req.file = await checkBase64(req.body);
      return next();
    } catch (err) {
      if (err === invalidRequest) throw Boom.badRequest(invalidRequest);
      throw Boom.internal();
    }
  },
};
