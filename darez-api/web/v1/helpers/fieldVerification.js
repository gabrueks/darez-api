module.exports = (field) => (
  typeof (field) === 'string' ? [field] : field
);
