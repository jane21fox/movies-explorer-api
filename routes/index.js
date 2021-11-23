const router = require('express').Router();
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const { validateUserBody, validateUserCreateBody } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validateUserBody, login);
router.post('/signup', validateUserCreateBody, createUser);

router.use(auth);

router.use('/movies', moviesRouter);
router.use('/users', usersRouter);
router.use('*', (req, res, next) => {
  const err = new NotFoundError('Метод не найден');
  next(err);
});

module.exports = router;
