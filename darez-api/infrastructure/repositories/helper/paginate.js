module.exports = (page, pageSize) => (
  {
    offset: page * pageSize,
    // eslint-disable-next-line radix
    limit: parseInt(pageSize),
  }
);
