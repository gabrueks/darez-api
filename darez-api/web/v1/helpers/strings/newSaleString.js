module.exports = (userName, orderId, products, totalPrice, paymentMethod, change = 'Não precisa', observations = '', address, phoneNumber, date, time) => `${userName} gostaria de fazer o pedido abaixo:

PEDIDO: ${orderId}

${products}
Valor total: R$ ${totalPrice.toFixed(2)}
Pagamento: ${paymentMethod}
Troco: ${change}

Observação:
${observations}

Entrega:
${address}

Telefone: ${phoneNumber}

Pedido feito em ${date} às ${time}
Para confirmar entre em:
https://www.compredolado.com.br/conta/minhas-vendas/info/${orderId}`;
