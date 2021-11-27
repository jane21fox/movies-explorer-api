const moviesRouter = require('express').Router();
const { validateMovieCreateBody, validateMovieDelParams } = require('../middlewares/validation');
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.delete('/:movieId', validateMovieDelParams, deleteMovie);
moviesRouter.post('/', validateMovieCreateBody, createMovie);

module.exports = moviesRouter;
