const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/error-unathorized');

// const JWT_SECRET = 'secret'
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  const token = authorization.replace('Bearer ', '')
  // const token = req.cookies.jwt;
  let payload;

  try {
    // payload = jwt.verify(token, JWT_SECRET)
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    throw new UnauthorizedError('Отказ в авторизации!');
  }
  req.user = payload;
  next();
}