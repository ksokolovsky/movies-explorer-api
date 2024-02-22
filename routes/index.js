const express = require('express');
const { celebrate } = require('celebrate');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const { loginSchema, registrationSchema } = require('../middlewares/validationSchemas');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found');

const router = express.Router();

// login/reg/logout
router.post('/signin', loginSchema, login);
router.post('/signup', registrationSchema, createUser);
router.post('/signout', (req, res) => {
  // Так как токен хранится не в куки, а в локалсторадже, логика должна быть на клиенте.
  // Сервер просто покажет сообщение, что успешно вышли из системы.
  res.status(200).send({ message: 'Вы успешно вышли из системы' });
});

// auths
router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

// 404
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден. Неизвестный маршрут'));
});

module.exports = router;
