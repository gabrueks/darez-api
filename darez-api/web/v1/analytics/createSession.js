const axios = require('axios').default;
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const {
  ANLY_SVC_URL,
} = process.env;

module.exports = async (user, isConsultant = false, consultantName, accessToken, app) => {
  const sessionData = {
    data: {
      name: user.full_name,
      isConsultant,
      consultantName,
      phone: `+${user.phone_country_code}${user.phone_area_code}${user.phone_number}`,
      document: user.document,
      requestedAt: user.confirmation_code_requested_at,
      loginType: user.last_login_type,
      app,
    },
  };
  try {
    await axios.post(`${ANLY_SVC_URL}/session`,
      sessionData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  } catch (err) {
    toSlack(SLACK_ERR, err, 'analytics/createSession');
  }
};
