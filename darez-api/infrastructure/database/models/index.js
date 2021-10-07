/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../../config/sequelize');

// eslint-disable-next-line no-console

const db = {};
const basename = path.basename(__filename);
const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
<<<<<<< HEAD
  logging: !['test', 'production'].includes(process.env.NODE_ENV),
=======
  // eslint-disable-next-line no-console
  logging: (['test', 'production'].includes(process.env.NODE_ENV)) ? false : console.log,
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
});

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(async (file) => {
    const model = await require(path.join(__dirname, file));
    const modelInstance = model(sequelize, DataTypes);
    db[modelInstance.name] = modelInstance;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }

  if (db[modelName].loadScopes) {
    db[modelName].loadScopes(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
