const SALT_ROUND = 10;
const { JWT_SECRET = 'dev-key', BD_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  SALT_ROUND,
  JWT_SECRET,
  BD_URL,
};
