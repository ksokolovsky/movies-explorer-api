const { celebrate, Joi, Segments } = require('celebrate');

const movieIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
};

const movieCreateSchema = {
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri(),
    trailerLink: Joi.string().required().uri(),
    thumbnail: Joi.string().required().uri(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const registrationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    // name: Joi.string().min(2).max(30),
  }),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateProfileSchema = celebrate({
  body: Joi.object().keys({
    // name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const userIdSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  userIdSchema,
  registrationSchema,
  updateProfileSchema,
  movieIdSchema,
  movieCreateSchema,
  loginSchema,
};
