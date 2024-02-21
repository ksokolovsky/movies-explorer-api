const express = require('express');
const { celebrate } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { movieIdSchema, movieCreateSchema } = require('../middlewares/validationSchemas');

const router = express.Router();

router.get('/', getMovies);
router.post('/', celebrate(movieCreateSchema), createMovie);
router.delete('/:_id', celebrate(movieIdSchema), deleteMovie);

module.exports = router;
