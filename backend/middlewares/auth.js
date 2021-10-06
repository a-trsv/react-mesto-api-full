const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/error-unathorized');

// const JWT_SECRET = 'secret'
const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  const token = req.cookies.jwt;
  let payload;

  try {
    // payload = jwt.verify(token, JWT_SECRET)
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (error) {
    throw new UnauthorizedError('Отказ в авторизации!');
  }
  req.user = payload;
  next();
}

module.exports = auth;
