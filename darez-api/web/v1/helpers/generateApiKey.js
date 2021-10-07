const crypto = require('crypto');

const { ANLY_API_KEY_SECRET } = process.env;

module.exports = (userId, iat) => {
  try {
    return crypto.createHmac('sha256', ANLY_API_KEY_SECRET)
      .update(`${userId}${iat}`)
      .digest('hex');
  } catch {
    return 'invalid';
  }
};
