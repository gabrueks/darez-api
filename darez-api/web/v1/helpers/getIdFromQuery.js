const { invalidRequest } = require('./strings/error');
const decodeToken = require('./decodeToken');

module.exports = ({ token, ID }) => {
  if (!token) {
    if (!ID) throw new Error(invalidRequest);
    return ID;
  }
  const { company_id: companyId } = decodeToken(token);
  return companyId;
};
