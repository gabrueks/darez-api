/* eslint-disable */
const Jimp = require('jimp');
const { S3 } = require('aws-sdk');
const fs = require('fs');
const { Op } = require('sequelize');
const database = require('../darez-api/infrastructure/database/models');

const { AWS_BUCK_URL: bucketUrl, AWS_BUCKET_NAME } = process.env;

const bannerHeight = 300;
const bannerLength = 1280;

const s3Client = new S3();

const uploadFile = async (Key) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    ACL: 'public-read',
    Body: fs.createReadStream(`uploads/${Key}`),
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
  const companies = await database.Company.findAll({
    attributes: ['id', 'banner'],
    raw: true,
    where: {
      [Op.and]: {
        [Op.not]: { banner: null },
        active: 1,
      },
    },
  });
  await Promise.all(companies.map(async ({ banner }) => {
    const image = await Jimp.read(bucketUrl + banner);
    if (image.bitmap.height > bannerHeight || image.bitmap.width > bannerLength) {
      image
        .scaleToFit(bannerLength, bannerHeight)
        .write(`uploads/${banner}`);
      await deleteFile(banner);
      await uploadFile(banner);
      fs.unlinkSync(`uploads/${banner}`);
    }
  }));
})();
