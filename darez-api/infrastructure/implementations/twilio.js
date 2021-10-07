const Boom = require('@hapi/boom');

const {
  TWILIO_DEFAULT_NUMBER,
} = process.env;

module.exports = class TwilioImplementation {
  constructor(twilioClient) {
    this.twilioClient = twilioClient;
  }

  async sendMessage(message, phoneNumber, type = 'SMS') {
    const platform = type === 'WTS' ? 'whatsapp:+' : '';
    try {
      await this.twilioClient.messages
        .create({
          from: `${platform}${TWILIO_DEFAULT_NUMBER}`,
          body: message,
          to: `${platform}${phoneNumber}`,
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('SEND MESSAGE => ', err);
      throw Boom.internal(err);
    }
  }
};
