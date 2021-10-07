const { Router } = require('express');
const { twilioClient } = require('../../../infrastructure/adapters/twilio');
const TwilioImplementation = require('../../../infrastructure/implementations/twilio');

const twilioImplementation = new TwilioImplementation(twilioClient);

module.exports = Router()
  // Deprecated
  .post('/sms', async (req, res) => {
    await twilioImplementation.sendMessage(`Sua loja tem uma nova venda!\n
Entre em nossa plataforma para visualizar o pedido.\n
https://www.compredolado.com.br\n
O método de pagamento escolhido pelo cliente foi:\n\n
${req.body.paymentMethod}\n\n`, req.body.phoneNumber, 'SMS');
    return res.status(410).end();
  });
