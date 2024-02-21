// const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');

// Получаем все карточки
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send({ data: movies });
  } catch (error) {
    next(error);
  }
};

// Создаем новый фильм
exports.createMovie = async (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });
    res.status(201).send({ data: movie });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для создания фильма'));
    } else {
      next(error);
    }
  }
};

// Удаляем фильм, если он принадлежит текущему пользователю
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params._id);
    if (!movie) {
      next(new NotFoundError('Фильм с указанным ID не найден'));
      return;
    }

    if (movie.owner.toString() !== req.user._id) {
      next(new ForbiddenError('Недостаточно прав для удаления фильма'));
      return;
    }

    await Movie.findByIdAndDelete(req.params._id);
    res.send({ message: `Фильм ${movie.nameRU} удален` });
  } catch (error) {
    next(error);
  }
};
