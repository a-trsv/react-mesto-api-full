const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const {
  userIdValidation,
  userUpdateValidation,
  userAvatarUpdateValidation,
} = require('../middlewares/validation');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:userId', userIdValidation, getUserById);
userRouter.patch('/users/me', userUpdateValidation, updateUser);
userRouter.patch('/users/me/avatar', userAvatarUpdateValidation, updateUserAvatar);

module.exports = userRouter;
