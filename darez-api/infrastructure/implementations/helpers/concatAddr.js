module.exports = (obj) => `${obj.street_number} ${obj.street ? obj.street : ''} ${obj.city ? obj.city : ''}${obj.state ? `/${obj.state}` : ''}${obj.cep ? ` - ${obj.cep}` : ''}`;
