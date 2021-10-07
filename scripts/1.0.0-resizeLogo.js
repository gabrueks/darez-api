/* eslint-disable */
const Jimp = require('jimp');
const { S3 } = require('aws-sdk');
const fs = require('fs');
const { Op } = require('sequelize');
const database = require('../darez-api/infrastructure/database/models');

const { AWS_BUCK_URL: bucketUrl, AWS_BUCKET_NAME } = process.env;

const logoHeight = 180;
const logoLength = 180;

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
    attributes: ['id', 'logo'],
    raw: true,
    where: {
      [Op.and]: {
        [Op.not]: { logo: null },
        active: 1,
      },
    },
    limit: 2,
  });
  await Promise.all(companies.map(async ({ logo }) => {
    const image = await Jimp.read(bucketUrl + logo);
    if (image.bitmap.height > logoHeight || image.bitmap.width > logoLength) {
      image
        .scaleToFit(logoLength, logoHeight)
        .write(`uploads/${logo}`);
      await deleteFile(logo);
      await uploadFile(logo);
      fs.unlinkSync(`uploads/${logo}`);
    }
  }));
})();
