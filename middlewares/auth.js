const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/index');
const NotValidAuth = require('../errors/not-valid-auth');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new NotValidAuth('Необходима авторизация');
    return next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    const err = new NotValidAuth('Необходима авторизация');
    next(err);
  }

  req.user = payload;

  return next();
};
