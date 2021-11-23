const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SALT_ROUND, JWT_SECRET } = require('../configs/index');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidAuth = require('../errors/not-valid-auth');
const AlreadyExistsErr = require('../errors/already-exists-err');

const getActiveUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (user) return res.status(200).send(user);
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!name || !email || !password) {
    throw new NotValidAuth('Невалидные данные');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) throw new AlreadyExistsErr('Такой email уже зарегистрирован');
      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new NotValidAuth('Невалидные данные');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) throw new AlreadyExistsErr('Такой email уже зарегистрирован');
    })
    .then(() => User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    ))
    .then((user) => {
      if (user) return res.status(200).send(user);
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) throw new NotValidAuth('Невалидные данные при авторизации');

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new NotValidAuth('Невалидные данные при авторизации');
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotValidAuth('Невалидные данные при авторизации');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          res.send({ token });
          // res.cookie('jwt', token, {
          //   maxAge: 3600000 * 24 * 7,
          //   httpOnly: true,
          // }).send({ message: 'Ответ об успешном логин ' + token });
        });
    })
    .then((user) => res.status(201).send(user))
    .catch(next);
};

module.exports = {
  getActiveUser,
  createUser,
  updateUser,
  login,
};
