const moment = require('moment-timezone');
const weekdays = require('../helpers/weekdays');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const BusinessHoursRepository = require('../../../infrastructure/repositories/business_hours');
const { slackChannel: { SLACK_ERR } } = require('../helpers');
const { toSlack } = require('../slack');

const businessHoursRepository = new BusinessHoursRepository(database);

module.exports = {
  getShopHours: async ({ params, query }) => {
    try {
      const { ID } = params;
      const { DATETIME } = query;

      if (ID && DATETIME) {
        const businessHours = await businessHoursRepository.findOne(ID);

        // eslint-disable-next-line
        if (!businessHours) {
          return httpResponse(200, {
            shop_open: true,
          });
        }

        const d = moment(DATETIME).tz('America/Sao_Paulo');

        const weekDay = weekdays[d.weekday()];
        const todayOpen = `${weekDay}_open`;
        const todayClose = `${weekDay}_close`;

        const current = moment(d).locale('pt-br').format('HH:mm:ss');
        if (current >= businessHours[todayOpen]
          && current <= businessHours[todayClose]) {
          return httpResponse(200, {
            shop_open: true,
          });
        }
      }

      return httpResponse(200, {
        shop_open: false,
      });
    } catch (err) {
      toSlack(SLACK_ERR, err, 'businessHours/getShopHours');
      return httpResponse(500);
    }
  },
};
