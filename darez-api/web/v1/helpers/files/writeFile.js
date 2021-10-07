const fs = require('fs');

module.exports = (file, filename, enconding) => new Promise((resolve, reject) => {
  const destination = 'uploads/';
  const path = destination + filename;
  return fs.writeFile(path, file, enconding, (err) => {
    if (err) reject(err);
    resolve({ path, destination, filename });
  });
});
