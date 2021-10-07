module.exports = (addr) => `${addr.street} ${addr.street_number},${(addr.address_2) ? ` ${addr.address_2},` : ''} ${addr.neighborhood} - ${addr.city}, ${addr.state}`;
