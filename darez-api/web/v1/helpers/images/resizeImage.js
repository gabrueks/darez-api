const Jimp = require('jimp');

module.exports = async (imgPlace, sizeLength, sizeHeight, quality) => {
  const destination = `uploads/${imgPlace}`;
  const image = await Jimp.read(destination);
  if (image.bitmap.height > sizeHeight || image.bitmap.width > sizeLength) {
    image
      .scaleToFit(sizeLength, sizeHeight)
      .quality(quality)
      .write(destination);
  }
  return destination;
};
