const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxnlength: 30,
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        validator.isURL(url, { require_protocol: true });
      },
      message: 'Некорректная ссылка на картинку!',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный E-Mail!',
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
});

// проверка ввода и сравнения пароля с хэшем
userSchema.statics.findUserByCredentials = function credentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Введены некорректные почта и пароль!'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Введены некорректные почта и пароль!'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
