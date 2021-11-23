const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes');
const { BD_URL } = require('./configs/index');
const { limiter } = require('./middlewares/limiter');
const { handleErrors } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
const app = express();

const allowedCORS = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

app.use(allowedCORS);

mongoose.connect(BD_URL, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {});
