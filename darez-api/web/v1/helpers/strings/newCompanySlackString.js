const buildAdrres = require('../buildUserAddress');

module.exports = (company, owner, endpoint, creator) => `Nova loja!
Loja: ${company.fantasy_name}
Responsável: ${owner}
Telefone: ${company.phone_area_code} ${company.phone_number}
Endereço: ${buildAdrres(company)}
URL: https://www.compredolado.com.br/${endpoint}
Criador: ${creator}`;
