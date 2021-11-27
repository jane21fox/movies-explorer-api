const mongoose = require('mongoose');
const { isURL } = require('validator');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { errMsg } = require('../utils/const');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(image) {
        return isURL(image);
      },
      message: errMsg.notValidURL,
      statusCode: 400,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(trailer) {
        return isURL(trailer);
      },
      message: errMsg.notValidURL,
      statusCode: 400,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(thumbnail) {
        return isURL(thumbnail);
      },
      message: errMsg.notValidURL,
      statusCode: 400,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema.statics.defineOwnerAndDelete = function (movieId, userId) {
  return this.findById(movieId)
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errMsg.notFoundMovie);
      }
      if (movie.owner._id.valueOf() !== userId) {
        throw new ForbiddenError(errMsg.actionForbidden);
      }
      return this.findByIdAndRemove(movieId).populate(['owner']);
    });
};

module.exports = mongoose.model('movie', movieSchema);
