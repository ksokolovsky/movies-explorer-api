// Вынужденный комментарий потому что я не могу создать пул реквест чтобы играть по правилам.
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const winston = require('winston');
require('dotenv').config();
const expressWinston = require('express-winston');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
// const userRoutes = require('./routes/users');
// const movieRoutes = require('./routes/movies');
// const { login, createUser } = require('./controllers/users');
// const auth = require('./middlewares/auth');
// const { registrationSchema, loginSchema } = require('./middlewares/validationSchemas');
// const NotFoundError = require('./errors/not-found');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bitfilmsdb';
const allowedCors = [
  'https://diploma-sk.nomoredomainswork.ru',
  'https://api.diploma-sk.nomoredomainswork.ru',
  'http://diploma-sk.nomoredomainswork.ru',
  'http://api.diploma-sk.nomoredomainswork.ru',
  'http://localhost:3000',
  'https://localhost:3000',
];

app.use(cors());

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log', format: winston.format.json() }),
  ],
  format: winston.format.combine(
    winston.format.json(),
  ),
  expressFormat: true,
  colorize: false,
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', format: winston.format.json() }),
  ],
  format: winston.format.combine(
    winston.format.json(),
  ),
});

mongoose.connect(MONGODB_URI);
// mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});

app.use(requestLogger); // req logging

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.post('/signin', loginSchema, login);
// app.post('/signup', registrationSchema, createUser);

// app.use('/users', auth, userRoutes);
// app.use('/movies', auth, movieRoutes);

// app.use((req, res, next) => {
//   next(new NotFoundError('Запрашиваемый ресурс не найден. Неизвестный маршрут'));
// });

app.use('/', routes);

app.use(errorLogger); // error logging

app.use(errors());

app.use(errorHandler);
// app.use((error, req, res, next) => {
//   const { statusCode = 500, message } = error;
//   res.status(statusCode).send({
//     message: statusCode === 500
//       ? 'На сервере произошла ошибка'
//       : message,
//   });
//   next();
// });

app.listen(PORT);
