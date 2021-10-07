const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `img_${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}${Date.now()}${path.extname(file.originalname)}`),
});

module.exports = {
  upload: multer({
    storage,
    limits: { fileSize: 10000000 },
  }),
};
