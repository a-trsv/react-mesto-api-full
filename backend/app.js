require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT = 3000 } = process.env;
const { errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const { signInValidation, signUpValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger')
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
app.use(cors);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger)
app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use(errorLogger)
app.use('*', () => { throw new NotFoundError('Запрашиваемый адрес не найден'); });
app.use(errors());
app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
