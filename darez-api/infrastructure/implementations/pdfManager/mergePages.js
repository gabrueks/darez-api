const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const createFile = (path, buf, p1, p2) => new Promise((resolve) => {
  fs.open(path, 'w', (_error, fd) => {
    fs.write(fd, buf, 0, buf.length, null, () => {
      fs.close(fd, () => {
        fs.unlinkSync(`${__dirname}/pdfOutput/${p1}.pdf`);
        fs.unlinkSync(`${__dirname}/pdfOutput/${p2}.pdf`);
        return resolve();
      });
    });
  });
});

module.exports = async (page1, page2, companyId) => {
  const fileName = `merged_${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}_${companyId}${Date.now()}_report`;
  const path = `${__dirname}/pdfOutput/${fileName}.pdf`;

  const pdfBuffer1 = fs.readFileSync(`${__dirname}/pdfOutput/${page1}.pdf`);
  const pdfBuffer2 = fs.readFileSync(`${__dirname}/pdfOutput/${page2}.pdf`);

  const pdfsToMerge = [pdfBuffer1, pdfBuffer2];
  const mergedPdf = await PDFDocument.create();

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const pdfBytes of pdfsToMerge) {
    const typedPdfByteArray = Uint8Array.from(pdfBytes);
    const pdf = await PDFDocument.load(typedPdfByteArray);
    const copiedPages = await mergedPdf.copyPages(
      pdf,
      pdf.getPageIndices(),
    );
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const buf = await mergedPdf.save(); // Uint8Array
  await createFile(path, buf, page1, page2);

  return path;
};
