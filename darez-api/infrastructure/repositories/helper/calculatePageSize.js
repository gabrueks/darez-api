/**
 *
 * @param {object} result Object result databaset set
 * @param {integer} page Page number
 * @param {integer} pageSize Page size
 */
module.exports = {
  /**
   * Calculate the page and page size based on object database set
   *
   * @param {object} result Result set object
   * @param {integer} page page number
   * @param {integer} pageSize page size
   */
  calculatePageSize(result, page, pageSize) {
    const final = [];
    /* eslint-disable */
    const initial = parseInt(page) * parseInt(pageSize)
    const teoricalFinal = (parseInt(pageSize) + (parseInt(page) * parseInt(pageSize)))
    
    for(let i = initial; (i<teoricalFinal && i < result.length); i++) {
      final.push(result[i]);
    }
    /* eslint-enable */
    return final;
  },
};
