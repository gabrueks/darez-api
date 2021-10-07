module.exports = {
  settings: () => {
    const productsSettings = {
      searchableAttributes: [
        'name',
        'description',
        'category',
      ],
      attributesForFaceting: [ // para conseguir filtrar em seguida por loja
        'company_id', 'fantasy_name', 'variacoes.color', 'variacoes.size',
      ],
    };
    return productsSettings;
  },
};
