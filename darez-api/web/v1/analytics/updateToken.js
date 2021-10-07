const axios = require('axios').default;
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ERR } } = require('../helpers/strings');

const {
  ANLY_SVC_URL,
} = process.env;

module.exports = async (headers, newToken) => {
  const accessToken = headers.authorization.substring(0, 6) === 'Bearer'
    ? headers.authorization.split(' ')[1] : headers.authorization;
  try {
    await axios.put(`${ANLY_SVC_URL}/session`,
      { token: newToken },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  } catch (err) {
    toSlack(SLACK_ERR, err, 'analytics/updateSession');
  }
};
