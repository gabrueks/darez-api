const fs = require('fs');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const { s3Client } = require('../../../infrastructure/adapters/aws');
const ProductPhotoRepository = require('../../../infrastructure/repositories/product_photo');
const S3Implementation = require('../../../infrastructure/implementations/s3');
const { toSlack } = require('../slack');
const {
  resizeImage, thumbnailLength, thumbnailHeight, thumbnailQuality,
} = require('../helpers');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const productPhotoRepository = new ProductPhotoRepository(database);
const s3 = new S3Implementation(s3Client);

module.exports = {
  updateImage: async ({ params, files }) => {
    try {
      const mainImage = await productPhotoRepository.findMainOfProduct(['id', 'photo_key'], params.ID);
      await Promise.all(files.map(async (file, place) => {
        const { destination, filename } = file;
        const { key } = await s3.uploadFile(destination + filename, 'products');
        const uploadedImage = await productPhotoRepository.create({
          product_id: params.ID,
          photo_key: key,
          is_main: (place === 0 && !mainImage),
        });
        await resizeImage(filename, thumbnailLength, thumbnailHeight, thumbnailQuality);
        // eslint-disable-next-line
        const { key: thumbnailKey } = await s3.uploadFile(destination + filename, 'products/thumbnail');
        await productPhotoRepository.update(uploadedImage.id, { thumbnail: null });
        fs.unlinkSync(file.path);
      }));
      return httpResponse(204);
    } catch (err) {
      toSlack(SLACK_ERR, err, 'products/updateImage');
      return httpResponse(500);
    }
  },
};
