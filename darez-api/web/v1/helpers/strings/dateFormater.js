const moment = require('moment-timezone');

module.exports = (format, wantedDate = null) => {
  const nowTime = (wantedDate) ? moment(wantedDate).tz('America/Sao_Paulo') : moment().tz('America/Sao_Paulo');
  return (format === 'aaaa-mm-dd')
    ? moment(nowTime).locale('pt-br').format('YYYY-MM-DD')
    : moment(nowTime).locale('pt-br').format('DD-MM-YYYY');
};
