module.exports = (date, endTime = null) => {
  const raw = date.split('/');
  return raw[2].concat('-', raw[1], '-', raw[0], (endTime) ? ' 23:59:59 ' : ' 00:00:00');
};
