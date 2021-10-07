const twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = process.env;

module.exports = {
  twilioClient: twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
};
