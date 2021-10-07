/**
 * Simple function usefull to put zero in front of a number.
 *
 * @param {integer} number Number that will be completed with zeros
 * @param {integer} length Number of zeros that will be concat with
 */
module.exports = (number, length) => {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};
