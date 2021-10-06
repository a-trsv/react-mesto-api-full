const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

const userUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const isUrlValid = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new Error('Вы ввели некорректную ссылку!');
};

const userAvatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrlValid),
  }),
});

const newCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isUrlValid),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  userIdValidation,
  userUpdateValidation,
  userAvatarUpdateValidation,
  newCardValidation,
  cardIdValidation,
};
