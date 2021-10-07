/* eslint-disable */
const Jimp = require('jimp');
const { S3 } = require('aws-sdk');
const fs = require('fs');
const { Op } = require('sequelize');
const database = require('../darez-api/infrastructure/database/models');
const asyncPool = require('tiny-async-pool');

const { AWS_BUCK_URL: bucketUrl, AWS_BUCKET_NAME } = process.env;

const thumbnailLength = 170;
const thumbnailHeight = 170;

const productHeight = 286;
const productLength = 282;

const s3Client = new S3();

const uploadFile = async (Key, place) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    ACL: 'public-read',
    Body: fs.createReadStream(`uploads/${place}`),
    Key,
  };
  try {
    return s3Client.upload(params).promise();
  } catch (err) {
    throw console.log('UPLOAD => ', Key);
  }
};

const deleteFile = async (imageKey) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: imageKey,
  };
  try {
    await s3Client.deleteObject(params).promise();
  } catch (err) {
    console.log('DELETE => ', imageKey);
  }
};

(async () => {
  await database.sequelize.authenticate();
  const photos = await database.ProductPhoto.findAll({
    attributes: ['id', 'photo_key'],
    raw: true,
    where: {
      [Op.and]: {
        thumbnail: null,
        active: 1,
      },
    },
  });

  const promises = photos.map(async ({ id, photo_key }) => {
    try {
      const image = await Jimp.read(bucketUrl + photo_key);
      if (image.bitmap.height > productHeight || image.bitmap.width > productLength) {
        image
          .scaleToFit(productLength, productHeight)
          .write(`uploads/${photo_key}`);
        await deleteFile(photo_key);
        await uploadFile(photo_key, photo_key);

        image
          .scaleToFit(thumbnailLength, thumbnailHeight)
          .write(`uploads/${photo_key}`);
        const photoHash = photo_key.split('/')[1];
        await uploadFile(`products/thumbnail/${photoHash}`, photo_key);
        await database.ProductPhoto.update(
          { thumbnail: photoHash },
          {
            where: { id },
          },
        );
        fs.unlinkSync(`uploads/${photo_key}`);
      } else {
        image
          .scaleToFit(thumbnailLength, thumbnailHeight)
          .write(`uploads/${photo_key}`);
        const photoHash = photo_key.split('/')[1];
        await uploadFile(`products/thumbnail/${photoHash}`, photo_key);
        await database.ProductPhoto.update(
          { thumbnail: `products/thumbnail/${photoHash}` },
          {
            where: { id },
          },
        );
        fs.unlinkSync(`uploads/${photo_key}`);
        console.log('DONE');
      }
    } catch (err) {
      console.log(err);
      console.log('ERRO');
    }
  });

  return asyncPool(2, promises);
})();