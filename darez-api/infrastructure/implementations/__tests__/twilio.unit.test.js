const TwilioImplementation = require('../twilio');

describe('Unit Test: Twilio Implementation', () => {
  it('when I call sendMessage method then should call twilio once', async () => {
    const twilioClient = {
      messages: { create: jest.fn() },
    };
    const twilioImplementation = new TwilioImplementation(twilioClient);
    twilioImplementation.sendMessage('Some text', '5511912345678', 'SMS');
    expect(twilioClient.messages.create).toHaveBeenCalledTimes(1);
  });

  it('when I call sendMessage method and have some error then should throw an exception', async () => {
    const twilioClient = {
      messages: {
        create: () => {
          throw new Error('Some error');
        },
      },
    };

    try {
      const twilioImplementation = new TwilioImplementation(twilioClient);
      await twilioImplementation.sendMessage('Some text', '5511912345678', 'SMS');
    } catch (err) {
      expect(err).toEqual(new Error('Some error'));
    }
  });
});
