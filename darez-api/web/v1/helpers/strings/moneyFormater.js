const replaceAll = (str, search, replace) => str.split(search).join(replace);

module.exports = (value) => {
  const strValue = parseFloat(value)
    .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let result = replaceAll(strValue, ',', 'x');
  result = replaceAll(result, '.', ',');
  result = replaceAll(result, 'x', '.');
  return result;
};
