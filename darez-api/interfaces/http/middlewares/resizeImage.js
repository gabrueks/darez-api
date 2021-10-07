const Jimp = require('jimp');
const Boom = require('@hapi/boom');

const resizeFile = async (file, sizeLength, sizeHeight, quality) => {
  const image = await Jimp.read(file);
  if (image.bitmap.height > sizeHeight || image.bitmap.width > sizeLength) {
    image
      .scaleToFit(sizeLength, sizeHeight)
      .quality(quality)
      .write(file);
  }
};

module.exports = {
  resizeImageMiddleware: (sizeLength, sizeHeight, quality) => async (req, _res, next) => {
    try {
      if (req.files) {
        await Promise.all(
          req.files.map(({ path }) => resizeFile(path, sizeLength, sizeHeight, quality)),
        );
        return next();
      }
      await resizeFile(req.file.path, sizeLength, sizeHeight, quality);
      return next();
    } catch (err) {
      throw Boom.internal();
    }
  },
};
