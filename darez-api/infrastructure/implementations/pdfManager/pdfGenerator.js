const pdf = require('pdf-creator-node');
const fs = require('fs');

const options = {
  format: 'A4',
  orientation: 'portrait',
};

module.exports = async (template, data, companyId) => {
  const fileName = `${template}_${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}_${companyId}${Date.now()}_report`;
  const html = fs.readFileSync(`${__dirname}/pdfTemplates/${template}.html`, 'utf8');

  const document = {
    html,
    data,
    path: `${__dirname}/pdfOutput/${fileName}.pdf`,
  };

  await pdf.create(document, options)
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));

  return fileName;
};
