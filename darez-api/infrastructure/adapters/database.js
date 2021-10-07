const { exec } = require('child_process');
const database = require('../database/models');

module.exports = {
  database,
  setupDatabaseConnection: async () => {
    await database.sequelize.authenticate();

    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'develop') {
      await new Promise((resolve, reject) => {
        const migrate = exec(
          'npx sequelize-cli db:migrate',
          { env: process.env },
          (err) => (err ? reject(err) : resolve()),
        );

        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
      });
    }
  },
};
