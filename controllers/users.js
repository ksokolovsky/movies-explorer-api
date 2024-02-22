const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const validator = require('validator');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
const UnauthorizedError = require('../errors/unauthorized');
const { jwtSecret } = require('../config');

// Получение информации о текущем пользователе
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send({ email: user.email, name: user.name });
  } catch (error) {
    next(error);
  }
};

exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        email,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((error) => {
          if (error.code === 11000) {
            next(new ConflictError('Этот email уже зарегистрирован'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

// Обновление информации пользователя
exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    res.send({ data: { name: updatedUser.name, email: updatedUser.email } });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные для обновления профиля'));
    } else if (error.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(error);
    }
  }
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Неправильные почта или пароль'));
            return;
          }
          const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });
          res.send({ token, message: 'Аутентификация прошла успешно' });
        })
        .catch(next);
    })
    .catch(next);
};
