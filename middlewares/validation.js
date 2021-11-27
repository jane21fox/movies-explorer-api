const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const { errMsg } = require('../utils/const');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserCreateBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserUpdateBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovieCreateBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) return value;
      return helpers.message(errMsg.notValidURL);
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) return value;
      return helpers.message(errMsg.notValidURL);
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) return value;
      return helpers.message(errMsg.notValidURL);
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieDelParams = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateUserCreateBody,
  validateUserUpdateBody,
  validateMovieCreateBody,
  validateMovieDelParams,
};
