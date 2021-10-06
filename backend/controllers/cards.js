const Card = require('../models/card');

// Errors

// 400 -> переданы некорректные данные
const RequestError = require('../middlewares/errors/request-error');
// 404 -> карточка/пользователь не найдены
const NotFoundError = require('../middlewares/errors/not-found-error');
// 403 -> доступ запрещен
const AccessError = require('../middlewares/errors/access-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        console.log(error);
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    })
    .catch(next);
};

// feat: сначала проверить права на удаление карточки, затем удалить
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('card не найденa с таким id!'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new AccessError('У вас нет прав на удаление этой карточки!'));
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        console.log(req.params.cardId);
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('card не найденa с таким id!'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        console.log(error);
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('card не найденa с таким id!'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new RequestError('Введенные данные некорректны!'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
