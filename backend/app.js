require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT = 3000 } = process.env;
const { errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const { signInValidation, signUpValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// 404 -> карточка/пользователь не найдены
const NotFoundError = require('./middlewares/errors/not-found-error');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();
const allowedCorsLinks = [
  'http://a-trsv.nomoredomains.monster',
  'https://a-trsv.nomoredomains.monster',
  'https://api.a-trsv.nomoredomains.club',
  'http://api.a-trsv.nomoredomains.club',
  'http://84.201.177.135',
  'localhost:3000',
  'http://localhost:3000',
];
app.use(cors({
  origin: allowedCorsLinks,
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUTP, PATCH, POST, DELETE, OPTIONS');
  next();
});
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);
const crashtest = () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
};
app.get('/crash-test', crashtest);
app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', () => { throw new NotFoundError('Запрашиваемый адрес не найден'); });
app.use(errorLogger);
app.use(errors());
app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
