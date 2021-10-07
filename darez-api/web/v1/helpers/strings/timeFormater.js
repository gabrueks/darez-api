const moment = require('moment-timezone');

module.exports = (format, wantedDate = null) => {
  const nowTime = (wantedDate) ? moment(wantedDate).tz('America/Sao_Paulo') : moment().tz('America/Sao_Paulo');
  return (format === 'hh:mm:ss')
    ? moment(nowTime).format('HH:mm:ss')
    : moment(nowTime).format('HH:mm');
};
