const usersRouter = require('express').Router();
const { validateUserUpdateBody } = require('../middlewares/validation');
const {
  getActiveUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getActiveUser);
usersRouter.patch('/me', validateUserUpdateBody, updateUser);

module.exports = usersRouter;
