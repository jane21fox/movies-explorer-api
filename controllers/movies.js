const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const { errMsg } = require('../utils/const');

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .populate(['owner'])
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.defineOwnerAndDelete(movieId, req.user._id)
    .then((movie) => {
      if (movie) return res.status(200).send(movie);
      throw new NotFoundError(errMsg.notFoundMovie);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const movieInfo = {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: {
      _id: req.user._id,
    },
  };
  return Movie.create(movieInfo)
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
