const buildAdrres = require('../buildUserAddress');

module.exports = (orderId, company, user, products, price, paymentMethod) => `Novo pedido!
ID: ${orderId}
Loja: ${company.fantasy_name}
Responsável: ${company.owner}
Telefone: ${company.phone_area_code} ${company.phone_number}
Endereço (Loja): ${buildAdrres(company)}
Cliente: ${user.userName}
Telefone: ${user.userPhoneAreaCode} ${user.userPhoneNumber}
Endereço (Cliente): ${user.address}
Produtos: ${products}
Total: R$ ${price.toFixed(2)}
Método de pagamento: ${paymentMethod}`;
