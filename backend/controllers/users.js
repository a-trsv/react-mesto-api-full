const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV } = process.env;
const { JWT_SECRET = 'secret' } = process.env;
const User = require('../models/user');

// Errors

// 400 -> переданы некорректные данные
// const ERROR_REQUEST = 400
const RequestError = require('../middlewares/errors/request-error');
// 404 -> карточка/пользователь не найдены
// const ERROR_CODE = 404
const NotFoundError = require('../middlewares/errors/not-found-error');
// 401 -> ошибка аутентификации/авторизации
const UnauthorizedError = require('../middlewares/errors/error-unathorized');
// const ERROR_UNAUTHORIZED = 401
// 409 -> ошибка совпадени E-Mail при регистрации
const ExistEmailError = require('../middlewares/errors/exist-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Контроллер для получения инфо о пользователе -> GET users/me

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден с таким id!');
    }
    res.send(user);
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      throw new RequestError('Введенные данные некорректны! a pochemy xz');
    } else {
      next(error);
    }
  });

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь не найден с таким id!'))
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        // console.log(req.params.userId)
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new RequestError('Введенные данные некорректны!'));
      } else if (error.name === 'MongoError' && error.code === 11000) {
        next(new ExistEmailError('Данный E-Mail уже зарегистрирован!'));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: 'token передан!' });
    })
    .catch(() => next(new UnauthorizedError('Ошибка Авторизации')));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateUser,
  updateUserAvatar,
};
