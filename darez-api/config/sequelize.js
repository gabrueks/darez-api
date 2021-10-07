require('dotenv/config');

const {
  DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASS,
} = process.env;

module.exports = {
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  pool: {
    max: 35,
    min: 0,
    acquire: 100000,
  },
};
